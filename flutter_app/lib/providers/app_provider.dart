import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../services/location_service.dart';

class AppProvider extends ChangeNotifier {
  final ApiService _api = ApiService(userId: 1);
  final LocationService _locationService = LocationService();

  // ── State ──
  String currentMode = 'DEFAULT';
  String currentPlace = '';
  String aiInsight = '';
  List<String> recommendations = [];
  List<Place> places = [];
  List<PatternResponse> patterns = [];
  List<ModeChangeEvent> modeHistory = [];
  bool serverOnline = false;
  bool isTracking = false;
  bool isLoading = false;
  Position? lastPosition;

  // ── Init ──
  Future<void> init() async {
    isLoading = true;
    notifyListeners();

    serverOnline = await _api.checkHealth();
    if (serverOnline) {
      await Future.wait([
        fetchCurrentMode(),
        fetchPlaces(),
        fetchPatterns(),
      ]);
    }

    isLoading = false;
    notifyListeners();
  }

  // ── Fetch ──
  Future<void> fetchCurrentMode() async {
    try {
      currentMode = await _api.getCurrentMode();
      notifyListeners();
    } catch (e) {
      debugPrint('Mode fetch error: $e');
    }
  }

  Future<void> fetchPlaces() async {
    try {
      places = await _api.getPlaces();
      notifyListeners();
    } catch (e) {
      debugPrint('Places fetch error: $e');
    }
  }

  Future<void> fetchPatterns() async {
    try {
      patterns = await _api.getPatterns();
      notifyListeners();
    } catch (e) {
      debugPrint('Patterns fetch error: $e');
    }
  }

  // ── Location Tracking ──
  Future<bool> startTracking() async {
    final hasPermission = await _locationService.requestPermission();
    if (!hasPermission) return false;

    _locationService.startTracking(
      onPosition: _onLocationUpdate,
      interval: const Duration(seconds: 60),
    );

    isTracking = true;
    notifyListeners();
    return true;
  }

  void stopTracking() {
    _locationService.stopTracking();
    isTracking = false;
    notifyListeners();
  }

  Future<void> _onLocationUpdate(Position position) async {
    lastPosition = position;
    try {
      final response = await _api.updateLocation(
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        speed: position.speed,
      );

      if (response.currentMode != currentMode) {
        // Mode changed
        modeHistory.insert(0, ModeChangeEvent(
          previousMode: currentMode,
          currentMode: response.currentMode,
          placeName: response.currentPlace,
          aiRecommendation: response.aiInsight,
          suggestedActions: response.recommendations,
          timestamp: DateTime.now().millisecondsSinceEpoch,
        ));
        if (modeHistory.length > 50) modeHistory = modeHistory.sublist(0, 50);
      }

      currentMode = response.currentMode;
      currentPlace = response.currentPlace;
      aiInsight = response.aiInsight;
      recommendations = response.recommendations;
      notifyListeners();
    } catch (e) {
      debugPrint('Location update error: $e');
    }
  }

  // ── Manual location send (testing) ──
  Future<void> sendManualLocation(double lat, double lng) async {
    try {
      final response = await _api.updateLocation(latitude: lat, longitude: lng);
      if (response.currentMode != currentMode) {
        modeHistory.insert(0, ModeChangeEvent(
          previousMode: currentMode,
          currentMode: response.currentMode,
          placeName: response.currentPlace,
          aiRecommendation: response.aiInsight,
          suggestedActions: response.recommendations,
          timestamp: DateTime.now().millisecondsSinceEpoch,
        ));
      }
      currentMode = response.currentMode;
      currentPlace = response.currentPlace;
      aiInsight = response.aiInsight;
      recommendations = response.recommendations;
      notifyListeners();
    } catch (e) {
      debugPrint('Manual location error: $e');
    }
  }

  // ── Place CRUD ──
  Future<bool> addPlace(Place place) async {
    try {
      final created = await _api.createPlace(place);
      places.add(created);
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Add place error: $e');
      return false;
    }
  }

  // ── Parse AI Insight ──
  String get parsedInsight {
    try {
      final parsed = jsonDecode(aiInsight);
      return parsed['insight'] ?? aiInsight;
    } catch (_) {
      return aiInsight.isNotEmpty ? aiInsight : '위치가 변경되면 AI가 맥락을 분석합니다';
    }
  }

  List<String> get parsedActions {
    try {
      final parsed = jsonDecode(aiInsight);
      return List<String>.from(parsed['actions'] ?? []);
    } catch (_) {
      return recommendations;
    }
  }

  @override
  void dispose() {
    _locationService.dispose();
    _api.dispose();
    super.dispose();
  }
}
