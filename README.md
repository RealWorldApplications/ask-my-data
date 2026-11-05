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
4. Run the starter app (`flutter pub get` and `flutter run -d chrome`)
5. Connect your Flutter project to Firebase (this registers your Web app in Firebase):
   ```bash
   firebase login
   flutterfire configure --platforms=web
   ```
   > **Tips:**
   > - If you get `flutterfire: command not found`, run `dart pub global run flutterfire_cli:flutterfire configure --platforms=web` directly, or add Dart's global bin folder to your PATH (`export PATH="$PATH":"$HOME/.pub-cache/bin"` on Mac/Linux).
   > - If you get `Failed to create Web app` (rate limit when many attendees run it at once), click the **`</>` (Web)** icon on the Firebase Console Project Overview page to register your Web app first, then re-run `flutterfire configure --platforms=web`.
6. Add the Firebase packages:
   ```bash
   flutter pub add firebase_core cloud_firestore firebase_ai firebase_app_check
   ```
7. Initialize Firebase & **App Check** in `lib/main.dart`:
   - Copy the `main.dart` snippet from **Step 4** of the [Reference Guide](https://docs.google.com/document/d/1aHt5OGAO6Y5mp6QGx0JRucH-H0J79GU0nEaNu5ByKwA/edit?usp=sharing) into `lib/main.dart`.
   - In the Firebase Console (**App Check → Apps**), click the `⋮` (three-dot menu) next to your Web app → **Manage debug tokens**, generate a debug token for `localhost`, and paste it directly into `WebDebugProvider(debugToken: 'YOUR_DEBUG_TOKEN')` in `lib/main.dart`.
   - *(Optional for Firebase Hosting deployment: click **Register → Fraud Defense** and paste your Website Key ID into `ReCaptchaEnterpriseProvider('YOUR_FRAUD_DEFENSE_SITE_KEY')`.)*
8. Seed the Orlando restaurants dataset into Firestore:
   ```bash
   node data/seed.js
   ```

### Module 1 — Core chat loop
Replace `_placeholderReply` in `lib/chat_screen.dart` with a real call through `FirebaseAI.googleAI().generativeModel(...)`. Ask it something about a specific restaurant — watch it confidently make something up. That's the hook for Module 2.

### Module 2 — Grounding with function calling
Add the `queryRestaurants` tool so the model pulls real answers from Firestore instead of guessing. Check the [`solution`](../../tree/solution) branch (`lib/services/gemini_chat_service.dart` and `lib/tools/restaurant_query_tool.dart`) for the target shape — build up to it rather than copy-pasting!

### Modules 3/4 — Stretch goals
Filters and follow-ups, source citations, and Firebase Auth.
