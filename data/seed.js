// Seeds restaurants.json into a Firestore `restaurants` collection using the
// Firebase Admin SDK. Run this once per Firebase project (yours for testing,
// or once per attendee if they're creating their own project in Module 0 —
// in that case, each attendee runs this themselves against their own
// project, which is also a nice quick intro to a Node script touching
// Firebase).
//
// Setup:
//   1. npm install firebase-admin
//   2. In the Firebase console: Project settings > Service accounts >
//      Generate new private key. Save the downloaded file as
//      serviceAccountKey.json in this same folder.
//      (Do NOT commit serviceAccountKey.json to git — it's a credential.)
//   3. node seed.js

const admin = require('firebase-admin');
const restaurants = require('./restaurants.json');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seed() {
  const batch = db.batch();
  const collection = db.collection('restaurants');

  for (const restaurant of restaurants) {
    const docRef = collection.doc();
    batch.set(docRef, restaurant);
  }

  await batch.commit();
  console.log(`Seeded ${restaurants.length} restaurants into Firestore.`);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
