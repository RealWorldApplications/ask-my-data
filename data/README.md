# data

`restaurants.json` — 12 fictional Orlando-area restaurants covering a spread of
cuisines, neighborhoods, and price ranges, built for the "ask my data" demo to
give attendees realistic things to ask about ("Thai food in Mills 50", "cheap
tacos", "somewhere fancy in Winter Park"). These are made up for the workshop,
not real businesses.

## Seeding it into Firestore

```
npm install firebase-admin
```

Then, in the Firebase console: **Project settings → Service accounts → Generate
new private key**, and save the file as `serviceAccountKey.json` in this folder.
(It's a credential — don't commit it to git. Add it to `.gitignore`.)

```
node seed.js
```

This writes all 12 documents into a `restaurants` collection with
auto-generated IDs.

## If attendees are creating their own Firebase projects (90-min+ slots)

Each attendee runs `npm install firebase-admin` and `node seed.js` against
their own project during Module 0, using their own service account key. It
takes under a minute and doubles as a quick, low-stakes first touch of
Firestore before the AI part of the workshop starts.

## If you're using a shared pre-provisioned project instead (tight 45–60 min slots)

Run this once yourself ahead of time — attendees just point their Flutter app
at the shared project's config and skip this step entirely.
