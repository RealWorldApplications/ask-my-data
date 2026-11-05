# Ask My Data — Completed Solution (`solution` branch)

This is the finished "Ask My Data" app: Firebase wired up, Gemini chat working, and the `queryRestaurants` function-calling tool fully implemented against Firestore.

> 📄 **[Workshop Reference Guide & Copy-Paste Commands (Google Doc)](https://docs.google.com/document/d/1aHt5OGAO6Y5mp6QGx0JRucH-H0J79GU0nEaNu5ByKwA/edit?usp=sharing)**
>
> **Looking for the starter project?** Switch back to the [`main`](../../tree/main) branch (`git checkout main`).

## Setup

Because every attendee connects to their own Firebase project, `lib/firebase_options.dart` is not checked into git. To run this branch:

1. Create (or reuse) a Firebase project with **Firestore** and **Firebase AI Logic** enabled. Choose the **Gemini Developer API** provider when prompted (stays on the free Spark plan, no billing account needed).
2. From the project root, generate your `lib/firebase_options.dart` (this also registers your Web app in Firebase):
   ```bash
   firebase login
   flutterfire configure --platforms=web
   ```
   > **Tips:**
   > - If you get `flutterfire: command not found`, run `dart pub global run flutterfire_cli:flutterfire configure --platforms=web` directly, or add Dart's global bin folder to your PATH (`export PATH="$PATH":"$HOME/.pub-cache/bin"` on Mac/Linux).
   > - If you get `Failed to create Web app` (rate limit when many attendees run it at once), click the **`</>` (Web)** icon on the Firebase Console Project Overview page to register your Web app first, then re-run `flutterfire configure --platforms=web`.
3. Set up **App Check** in the Firebase Console (**App Check → Apps**): click `⋮` next to your Web app → **Manage debug tokens** for `localhost`, or **Register → Fraud Defense** for Firebase Hosting.
4. **Seed the dataset** into your Firestore database (`node data/seed.js`) — see [`data/README.md`](data/README.md).
5. Run the app:
   ```bash
   flutter pub get
   flutter run -d chrome
   ```
5. Check [`lib/services/gemini_chat_service.dart`](lib/services/gemini_chat_service.dart) for the current Gemini model ID — copy it from the Firebase console (**AI Logic → your provider**) if model names have updated.

## What to try

- `"What Thai food is in Mills 50?"` — grounded, pulls from Firestore
- `"What's the best pizza in Orlando?"` — a great moment to see how the model handles a question its tool can't fully answer (no "best" field in the data)
- Ask about a neighborhood or cuisine that isn't in the seed data — watch it accurately report that it found nothing, instead of hallucinating

## Where the interesting code is

- [`lib/tools/restaurant_query_tool.dart`](lib/tools/restaurant_query_tool.dart) — the `FunctionDeclaration` Gemini sees, and the Firestore query it triggers
- [`lib/services/gemini_chat_service.dart`](lib/services/gemini_chat_service.dart) — the function-calling loop: send a message, handle any tool calls, send results back, repeat until there's a final answer
