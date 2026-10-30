# attendee-starter

A working Flutter chat UI with no Firebase wired in yet — that's what you'll add
live in Module 0.

## Run it now

```
flutter pub get
flutter run
```

You'll get a working chat screen that replies with a placeholder message. That's
expected — there's no AI connected yet.

## What you'll do, module by module

**Module 0 — Firebase fundamentals + setup**
1. Create a Firebase project in the console (free Spark plan, no credit card)
2. Enable Firestore
3. Enable Firebase AI Logic → choose the **Gemini Developer API** provider (stays
   on Spark, no billing)
4. Set up the App Check debug provider for local development
5. Run `flutterfire configure` in this folder
6. `flutter pub add firebase_core cloud_firestore firebase_ai`

**Module 1 — Core chat loop**
Replace `_placeholderReply` in `lib/chat_screen.dart` with a real call through
`FirebaseAI.googleAI().generativeModel(...)`. Ask it something about a specific
restaurant — watch it confidently make something up. That's the hook for Module 2.

**Module 2 — Grounding with function calling**
Add the `queryRestaurants` tool so the model pulls real answers from Firestore
instead of guessing. `../instructor-reference/lib/services/gemini_chat_service.dart`
and `../instructor-reference/lib/tools/restaurant_query_tool.dart` show the target
shape — build up to it rather than copy-pasting, that's the point of the exercise.

**Modules 3/4 — stretch goals**
Filters and follow-ups, source citations, and Firebase Auth. See the main
workshop guide for details.
