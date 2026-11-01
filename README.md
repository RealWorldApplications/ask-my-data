# Ask My Data — Workshop Starter

DevFest Florida Hackathon 2026 — A working Flutter chat UI with **no Firebase wired in yet** (you'll add that live in Module 0!).

> 📄 **[Workshop Reference Guide & Copy-Paste Commands (Google Doc)](https://docs.google.com/document/d/1aHt5OGAO6Y5mp6QGx0JRucH-H0J79GU0nEaNu5ByKwA/edit?usp=sharing)**
>
> 💡 **Looking for the completed code?** Switch to the [`solution`](../../tree/solution) branch (`git checkout solution`) to see the finished app with Firebase AI Logic and Firestore function calling wired up.

## Run it now

```bash
flutter pub get
flutter run -d chrome
```

You'll get a working chat screen that replies with a placeholder message. That's expected — there's no AI connected yet.

## What you'll do, module by module

### Module 0 — Firebase fundamentals + setup
1. Create a Firebase project in the console (free Spark plan, no credit card)
2. Enable **Firestore** (in Test Mode)
3. Enable **Firebase AI Logic** → choose the **Gemini Developer API** provider (stays on Spark, no billing)
4. Set up the **App Check** debug provider for local development
5. Connect your Flutter project and seed the Orlando restaurants dataset:
   ```bash
   firebase login
   flutterfire configure
   node data/seed.js
   ```
6. Add the Firebase packages:
   ```bash
   flutter pub add firebase_core cloud_firestore firebase_ai firebase_app_check
   ```

### Module 1 — Core chat loop
Replace `_placeholderReply` in `lib/chat_screen.dart` with a real call through `FirebaseAI.googleAI().generativeModel(...)`. Ask it something about a specific restaurant — watch it confidently make something up. That's the hook for Module 2.

### Module 2 — Grounding with function calling
Add the `queryRestaurants` tool so the model pulls real answers from Firestore instead of guessing. Check the [`solution`](../../tree/solution) branch (`lib/services/gemini_chat_service.dart` and `lib/tools/restaurant_query_tool.dart`) for the target shape — build up to it rather than copy-pasting!

### Modules 3/4 — Stretch goals
Filters and follow-ups, source citations, and Firebase Auth.
