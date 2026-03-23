import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';

class ApiService {
  // ⚠️ 실기기에서는 실제 서버 IP로 변경 (예: 192.168.0.10)
  // 에뮬레이터: Android → 10.0.2.2 / iOS → localhost
  static const String baseUrl = 'http://10.0.2.2:8081/api';

  final int userId;
  final http.Client _client = http.Client();

  ApiService({this.userId = 1});

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
  };

  // ── Location ──
  Future<LocationResponse> updateLocation({
    required double latitude,
    required double longitude,
    double accuracy = 10.0,
    double speed = 0.0,
  }) async {
    final res = await _client.post(
      Uri.parse('$baseUrl/location/update'),
      headers: _headers,
      body: jsonEncode({
        'userId': userId,
        'latitude': latitude,
        'longitude': longitude,
        'accuracy': accuracy,
        'speed': speed,
      }),
    );
    if (res.statusCode != 200) throw Exception('Location update failed: ${res.statusCode}');
    return LocationResponse.fromJson(jsonDecode(res.body));
  }

  Future<String> getCurrentMode() async {
    final res = await _client.get(
      Uri.parse('$baseUrl/location/current-mode?userId=$userId'),
      headers: _headers,
    );
    if (res.statusCode != 200) throw Exception('Mode fetch failed: ${res.statusCode}');
    return jsonDecode(res.body)['mode'] ?? 'DEFAULT';
  }

  // ── Places ──
  Future<List<Place>> getPlaces() async {
    final res = await _client.get(
      Uri.parse('$baseUrl/places?userId=$userId'),
      headers: _headers,
    );
    if (res.statusCode != 200) throw Exception('Places fetch failed: ${res.statusCode}');
    final List data = jsonDecode(res.body);
    return data.map((e) => Place.fromJson(e)).toList();
  }

  Future<Place> createPlace(Place place) async {
    final body = place.toJson();
    body['userId'] = userId;
    final res = await _client.post(
      Uri.parse('$baseUrl/places'),
      headers: _headers,
      body: jsonEncode(body),
    );
    if (res.statusCode != 201) throw Exception('Place create failed: ${res.statusCode}');
    return Place.fromJson(jsonDecode(res.body));
  }

  // ── Patterns ──
  Future<List<PatternResponse>> getPatterns() async {
    final res = await _client.get(
      Uri.parse('$baseUrl/patterns?userId=$userId'),
      headers: _headers,
    );
    if (res.statusCode != 200) throw Exception('Patterns fetch failed: ${res.statusCode}');
    final List data = jsonDecode(res.body);
    return data.map((e) => PatternResponse.fromJson(e)).toList();
  }

  // ── Health ──
  Future<bool> checkHealth() async {
    try {
      final res = await _client.get(Uri.parse('$baseUrl/health')).timeout(
        const Duration(seconds: 5),
      );
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  void dispose() => _client.close();
}
