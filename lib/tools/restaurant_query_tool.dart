import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_ai/firebase_ai.dart';

/// The tool definition Gemini sees. Keep the description specific — the
/// model decides *whether* and *how* to call this based on these strings,
/// so vague descriptions lead to vague (or missing) tool calls.
final FunctionDeclaration queryRestaurantsTool = FunctionDeclaration(
  'queryRestaurants',
  'Search the local restaurant dataset by cuisine, neighborhood, and/or '
      'price range. Use this whenever the user asks about specific '
      'restaurants, food options, or places to eat — never guess from '
      'general knowledge.',
  parameters: {
    'cuisine': Schema.string(
      description:
          'Type of food, e.g. Italian, Thai, BBQ, Vietnamese. '
          'Omit this field entirely to match any cuisine.',
    ),
    'neighborhood': Schema.string(
      description:
          'Area of Orlando, e.g. Mills 50, Winter Park, Downtown, '
          'Milk District. Omit this field entirely to match any area.',
    ),
    'priceRange': Schema.string(
      description:
          r'Price level as $, $$, or $$$. Omit this field entirely to '
          'match any price.',
    ),
  },
);

/// Runs the actual Firestore query described by [args] (the model's
/// function-call arguments) and returns a plain, JSON-serializable map —
/// that's what `Content.functionResponse` expects back.
Future<Map<String, dynamic>> runQueryRestaurants(
  Map<String, dynamic> args,
) async {
  Query<Map<String, dynamic>> query =
      FirebaseFirestore.instance.collection('restaurants');

  final cuisine = args['cuisine'] as String?;
  final neighborhood = args['neighborhood'] as String?;
  final priceRange = args['priceRange'] as String?;

  if (cuisine != null && cuisine.isNotEmpty) {
    query = query.where('cuisine', isEqualTo: cuisine);
  }
  if (neighborhood != null && neighborhood.isNotEmpty) {
    query = query.where('neighborhood', isEqualTo: neighborhood);
  }
  if (priceRange != null && priceRange.isNotEmpty) {
    query = query.where('priceRange', isEqualTo: priceRange);
  }

  final snapshot = await query.limit(5).get();

  if (snapshot.docs.isEmpty) {
    return {'results': [], 'note': 'No matching restaurants were found.'};
  }

  return {
    'results': snapshot.docs.map((doc) => doc.data()).toList(),
  };
}
