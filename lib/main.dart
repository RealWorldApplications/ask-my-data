import 'package:flutter/material.dart';

import 'chat_screen.dart';

void main() {
  runApp(const AskMyDataApp());
}

class AskMyDataApp extends StatelessWidget {
  const AskMyDataApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ask My Data',
      theme: ThemeData(
        colorSchemeSeed: Colors.deepPurple,
        useMaterial3: true,
      ),
      home: const ChatScreen(),
    );
  }
}
