package com.bomin.locationagent.dto;

import com.bomin.locationagent.model.Place;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

public class LocationDto {

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    public static class UpdateRequest {
        @NotNull private Long userId;
        @NotNull private Double latitude;
        @NotNull private Double longitude;
        private Float accuracy; // GPS 정확도 (m)
        private Float speed;   // 이동 속도 (m/s)
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class ModeChangeEvent {
        private String previousMode;
        private String currentMode;
        private String placeName;
        private String aiRecommendation;
        private List<String> suggestedActions;
        private long timestamp;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class LocationResponse {
        private String currentMode;
        private String currentPlace;
        private String aiInsight;
        private List<String> recommendations;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    public static class PlaceRequest {
        @NotNull private Long userId;
        @NotNull private String name;
        @NotNull private String type; // HOME, OFFICE, CAFE, etc.
        @NotNull private Double latitude;
        @NotNull private Double longitude;
        private Integer radiusMeters;
        private String linkedMode;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class PlaceResponse {
        private Long id;
        private String name;
        private String type;
        private Double latitude;
        private Double longitude;
        private Integer radiusMeters;
        private String linkedMode;

        public static PlaceResponse from(Place place) {
            return PlaceResponse.builder()
                    .id(place.getId())
                    .name(place.getName())
                    .type(place.getType().name())
                    .latitude(place.getLatitude())
                    .longitude(place.getLongitude())
                    .radiusMeters(place.getRadiusMeters())
                    .linkedMode(place.getLinkedMode() != null ? place.getLinkedMode().name() : null)
                    .build();
        }
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class PatternResponse {
        private String placeName;
        private String usualArrivalTime;
        private String usualDepartureTime;
        private String usualMode;
        private int visitCount;
        private String dayOfWeek;
    }
}
