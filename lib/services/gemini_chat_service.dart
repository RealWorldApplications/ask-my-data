import 'package:firebase_ai/firebase_ai.dart';

import '../tools/restaurant_query_tool.dart';

/// Wraps a Gemini chat session with the `queryRestaurants` tool registered,
/// and runs the full function-calling loop: send a prompt, and if the model
/// asks to call the tool, run it, send the result back, and repeat until the
/// model gives a final text answer.
///
/// This is the Module 2 payoff: the same `ask()` call used in Module 1 now
/// returns grounded answers instead of guesses, with no change needed to the
/// UI layer that calls it.
class GeminiChatService {
  GeminiChatService() : _chat = _buildModel().startChat();

  static GenerativeModel _buildModel() {
    return FirebaseAI.googleAI().generativeModel(
      // Check the Firebase console (AI Logic > choose a provider) for the
      // exact current model id — Gemini model names are versioned and
      // change over time.
      model: 'gemini-3.1-flash-lite',
      tools: [
        Tool.functionDeclarations([queryRestaurantsTool]),
      ],
    );
  }

  final ChatSession _chat;
  Future<String> ask(String prompt, {int maxRetries = 3}) async {
    int attempts = 0;

    while (true) {
      try {
        attempts++;
        var response = await _chat.sendMessage(Content.text(prompt));
        var calls = response.functionCalls.toList();

        while (calls.isNotEmpty) {
          for (final call in calls) {
            if (call.name == 'queryRestaurants') {
              final result = await runQueryRestaurants(call.args);
              response = await _chat.sendMessage(
                Content.functionResponse(call.name, result),
              );
            }
          }
          calls = response.functionCalls.toList();
        }

        return response.text ??
            "I wasn't able to come up with an answer for that.";
      } catch (e) {
        final isTransient = e.toString().contains('500') ||
            e.toString().contains('high demand') ||
            e.toString().contains('503');

        if (isTransient && attempts < maxRetries) {
          // Wait 1.5s, 3s with a small jitter
          await Future.delayed(Duration(milliseconds: 1500 * attempts));
          continue;
        }
        rethrow;
      }
    }
  }
}
