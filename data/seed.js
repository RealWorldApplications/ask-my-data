// Seeds restaurants.json into a Firestore `restaurants` collection.
//
// Works THREE ways (automatic fallback):
//   1. Uses your existing `firebase login` CLI session automatically (no
//      serviceAccountKey.json or npm install required!)
//   2. Or uses `serviceAccountKey.json` with firebase-admin if present
//   3. Or uses unauthenticated Firestore REST API if rules are in Test Mode
//
// Run from the `data/` folder:
//   node seed.js

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const restaurants = require('./restaurants.json');
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

function detectProjectId() {
  if (process.env.FIREBASE_PROJECT_ID) {
    return process.env.FIREBASE_PROJECT_ID;
  }
  const candidates = [
    path.join(__dirname, '..', 'lib', 'firebase_options.dart'),
    path.join(__dirname, '..', 'firebase.json'),
    path.join(__dirname, '..', 'instructor-reference', 'lib', 'firebase_options.dart'),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const dartMatch = content.match(/projectId:\s*'([^']+)'/);
      if (dartMatch) return dartMatch[1];
      const jsonMatch = content.match(/"projectId":\s*"([^"]+)"/);
      if (jsonMatch) return jsonMatch[1];
    }
  }
  return null;
}

function getFirebaseCliToken() {
  try {
    const configPath = path.join(
      os.homedir(),
      '.config',
      'configstore',
      'firebase-tools.json'
    );
    if (!fs.existsSync(configPath)) return null;
    let cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (cfg.tokens && cfg.tokens.expires_at && cfg.tokens.expires_at < Date.now() + 60000) {
      // Trigger Firebase CLI to refresh its OAuth token automatically
      try {
        execSync('firebase projects:list --json', { stdio: 'ignore' });
        cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (_) {}
    }
    if (cfg.tokens && cfg.tokens.access_token) {
      return cfg.tokens.access_token;
    }
  } catch (_) {}
  return null;
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        fields[key] = { integerValue: String(value) };
      } else {
        fields[key] = { doubleValue: value };
      }
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    }
  }
  return { fields };
}

async function seedWithRestApi(projectId, accessToken) {
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/restaurants`;
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Check if already seeded so running twice doesn't duplicate
  const listRes = await fetch(baseUrl, { headers });
  if (!listRes.ok) {
    const errText = await listRes.text();
    throw new Error(`Firestore check failed (${listRes.status}): ${errText}`);
  }
  const existing = await listRes.json();
  if (existing.documents && existing.documents.length > 0) {
    console.log(
      `Firestore in project "${projectId}" already has ${existing.documents.length} documents in 'restaurants'. Skipping duplicates.`
    );
    return;
  }

  for (const restaurant of restaurants) {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(toFirestoreFields(restaurant)),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to write ${restaurant.name} (${res.status}): ${errText}`);
    }
  }

  console.log(
    `Seeded ${restaurants.length} restaurants into Firestore (project: ${projectId}).`
  );
}

async function seedWithAdminSdk() {
  const admin = require('firebase-admin');
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  const batch = db.batch();
  const collection = db.collection('restaurants');

  for (const restaurant of restaurants) {
    const docRef = collection.doc();
    batch.set(docRef, restaurant);
  }

  await batch.commit();
  console.log(`Seeded ${restaurants.length} restaurants into Firestore.`);
}

async function main() {
  if (fs.existsSync(serviceAccountPath)) {
    await seedWithAdminSdk();
    return;
  }

  const projectId = detectProjectId();
  if (!projectId) {
    console.error(
      'Could not find projectId automatically. Please run `flutterfire configure` first, ' +
        'or pass FIREBASE_PROJECT_ID=your-project-id node seed.js'
    );
    process.exit(1);
  }

  const token = getFirebaseCliToken();
  try {
    await seedWithRestApi(projectId, token);
  } catch (err) {
    if (token) {
      // Retry without token in case token was expired and database is in test mode
      await seedWithRestApi(projectId, null);
    } else {
      throw err;
    }
  }
}

main().catch((err) => {
  console.error('Seeding failed:', err.message || err);
  process.exit(1);
});
