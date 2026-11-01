# data

`restaurants.json` — 12 fictional Orlando-area restaurants covering a spread of
cuisines, neighborhoods, and price ranges, built for the "ask my data" demo to
give attendees realistic things to ask about ("Thai food in Mills 50", "cheap
tacos", "somewhere fancy in Winter Park"). These are made up for the workshop,
not real businesses.

## Seeding it into Firestore

After running `firebase login` and `flutterfire configure` (from Module 0), simply run:

```bash
node data/seed.js
```

`seed.js` automatically reads your `projectId` from `lib/firebase_options.dart` and uses your `firebase login` session (or Firestore Test Mode rules) to upload all 12 documents into the `restaurants` collection — **no `npm install` or `serviceAccountKey.json` download required!**

*(Optional fallback: If you prefer using the Firebase Admin SDK with a service account, you can still run `npm install firebase-admin`, place `serviceAccountKey.json` in `data/`, and run `node seed.js`.)*
