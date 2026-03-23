class Place {
  final int? id;
  final String name;
  final String type;
  final double latitude;
  final double longitude;
  final int radiusMeters;
  final String? linkedMode;

  Place({
    this.id,
    required this.name,
    required this.type,
    required this.latitude,
    required this.longitude,
    this.radiusMeters = 100,
    this.linkedMode,
  });

  factory Place.fromJson(Map<String, dynamic> json) {
    return Place(
      id: json['id'],
      name: json['name'] ?? '',
      type: json['type'] ?? 'CUSTOM',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      radiusMeters: json['radiusMeters'] ?? 100,
      linkedMode: json['linkedMode'],
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'type': type,
    'latitude': latitude,
    'longitude': longitude,
    'radiusMeters': radiusMeters,
    if (linkedMode != null) 'linkedMode': linkedMode,
  };
}

class LocationResponse {
  final String currentMode;
  final String currentPlace;
  final String aiInsight;
  final List<String> recommendations;

  LocationResponse({
    required this.currentMode,
    required this.currentPlace,
    required this.aiInsight,
    required this.recommendations,
  });

  factory LocationResponse.fromJson(Map<String, dynamic> json) {
    return LocationResponse(
      currentMode: json['currentMode'] ?? 'DEFAULT',
      currentPlace: json['currentPlace'] ?? '',
      aiInsight: json['aiInsight'] ?? '',
      recommendations: List<String>.from(json['recommendations'] ?? []),
    );
  }
}

class PatternResponse {
  final String placeName;
  final String? usualArrivalTime;
  final String? usualDepartureTime;
  final String? usualMode;
  final int visitCount;
  final String? dayOfWeek;

  PatternResponse({
    required this.placeName,
    this.usualArrivalTime,
    this.usualDepartureTime,
    this.usualMode,
    required this.visitCount,
    this.dayOfWeek,
  });

  factory PatternResponse.fromJson(Map<String, dynamic> json) {
    return PatternResponse(
      placeName: json['placeName'] ?? '',
      usualArrivalTime: json['usualArrivalTime'],
      usualDepartureTime: json['usualDepartureTime'],
      usualMode: json['usualMode'],
      visitCount: json['visitCount'] ?? 0,
      dayOfWeek: json['dayOfWeek'],
    );
  }
}

class ModeChangeEvent {
  final String previousMode;
  final String currentMode;
  final String placeName;
  final String aiRecommendation;
  final List<String> suggestedActions;
  final int timestamp;

  ModeChangeEvent({
    required this.previousMode,
    required this.currentMode,
    required this.placeName,
    required this.aiRecommendation,
    required this.suggestedActions,
    required this.timestamp,
  });

  factory ModeChangeEvent.fromJson(Map<String, dynamic> json) {
    return ModeChangeEvent(
      previousMode: json['previousMode'] ?? 'DEFAULT',
      currentMode: json['currentMode'] ?? 'DEFAULT',
      placeName: json['placeName'] ?? '',
      aiRecommendation: json['aiRecommendation'] ?? '',
      suggestedActions: List<String>.from(json['suggestedActions'] ?? []),
      timestamp: json['timestamp'] ?? 0,
    );
  }
}
