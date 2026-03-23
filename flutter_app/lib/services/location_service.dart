import 'dart:async';
import 'package:geolocator/geolocator.dart';

class LocationService {
  StreamSubscription<Position>? _positionSubscription;
  Timer? _periodicTimer;

  /// GPS 권한 요청
  Future<bool> requestPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return false;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return false;
    }
    if (permission == LocationPermission.deniedForever) return false;

    return true;
  }

  /// 현재 위치 1회 가져오기
  Future<Position?> getCurrentPosition() async {
    try {
      return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
    } catch (e) {
      return null;
    }
  }

  /// 주기적 위치 추적 시작 (기본 60초)
  void startTracking({
    required Function(Position position) onPosition,
    Duration interval = const Duration(seconds: 60),
  }) {
    stopTracking();

    // 즉시 1회 전송
    getCurrentPosition().then((pos) {
      if (pos != null) onPosition(pos);
    });

    // 주기적 전송
    _periodicTimer = Timer.periodic(interval, (_) async {
      final pos = await getCurrentPosition();
      if (pos != null) onPosition(pos);
    });
  }

  /// 실시간 스트림 추적 (거리 변화 감지)
  void startStreamTracking({
    required Function(Position position) onPosition,
    int distanceFilter = 50,
  }) {
    stopTracking();

    _positionSubscription = Geolocator.getPositionStream(
      locationSettings: LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: distanceFilter,
      ),
    ).listen(onPosition);
  }

  void stopTracking() {
    _positionSubscription?.cancel();
    _positionSubscription = null;
    _periodicTimer?.cancel();
    _periodicTimer = null;
  }

  void dispose() => stopTracking();
}
