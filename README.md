# Ask My Data — Completed Solution (`solution` branch)

This is the finished "Ask My Data" app: Firebase wired up, Gemini chat working, and the `queryRestaurants` function-calling tool fully implemented against Firestore.

> **Looking for the starter project?** Switch back to the [`main`](../../tree/main) branch (`git checkout main`).

## Setup

Because every attendee connects to their own Firebase project, `lib/firebase_options.dart` is not checked into git. To run this branch:

1. **Seed the dataset** into your Firestore database — see [`data/README.md`](data/README.md).
2. Create (or reuse) a Firebase project with **Firestore** and **Firebase AI Logic** enabled. Choose the **Gemini Developer API** provider when prompted (stays on the free Spark plan, no billing account needed).
3. Set up the **App Check** debug provider for local development (required — Firebase AI Logic is deactivated without it).
4. From the project root, generate your `lib/firebase_options.dart` and run:
   ```bash
   flutterfire configure
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
