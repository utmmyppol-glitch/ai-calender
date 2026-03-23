package com.bomin.locationagent.service;

import com.bomin.locationagent.dto.LocationDto;
import com.bomin.locationagent.model.LocationLog;
import com.bomin.locationagent.model.Place;
import com.bomin.locationagent.model.Schedule;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LocationService {

    @PersistenceContext
    private EntityManager em;

    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Value("${openai.api-key}")
    private String openAiApiKey;

    @Value("${openai.model}")
    private String model;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private static final String MODE_KEY = "user:mode:";
    private static final String PLACE_KEY = "user:place:";
    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * 위치 업데이트 처리 — 핵심 로직
     */
    public LocationDto.LocationResponse updateLocation(LocationDto.UpdateRequest request) {
        Long userId = request.getUserId();
        double lat = request.getLatitude();
        double lng = request.getLongitude();

        // 1. 등록 장소 매칭 (Haversine)
        Place matchedPlace = findNearestPlace(userId, lat, lng);

        // 2. 현재 모드 조회
        String previousMode = getCurrentMode(userId);
        String currentPlace = matchedPlace != null ? matchedPlace.getName() : "이동 중";

        // 3. 모드 결정
        Place.Mode newMode = determineMode(matchedPlace, userId);
        String newModeStr = newMode.name();

        // 4. 모드 변경 시 → AI 추천 + WebSocket 알림
        List<String> recommendations = new ArrayList<>();
        String aiInsight = "";

        if (!newModeStr.equals(previousMode)) {
            // AI 맥락 분석 & 행동 추천
            aiInsight = getAiRecommendation(userId, currentPlace, newModeStr, lat, lng);
            recommendations = parseRecommendations(aiInsight);

            // WebSocket으로 모드 전환 이벤트 전송
            LocationDto.ModeChangeEvent event = LocationDto.ModeChangeEvent.builder()
                    .previousMode(previousMode)
                    .currentMode(newModeStr)
                    .placeName(currentPlace)
                    .aiRecommendation(aiInsight)
                    .suggestedActions(recommendations)
                    .timestamp(System.currentTimeMillis())
                    .build();

            messagingTemplate.convertAndSendToUser(
                    userId.toString(), "/queue/mode-change", event);
            messagingTemplate.convertAndSend(
                    "/topic/mode/" + userId, event);

            log.info("모드 전환: userId={}, {} → {} (장소: {})",
                    userId, previousMode, newModeStr, currentPlace);
        }

        // 5. Redis에 현재 상태 저장
        redisTemplate.opsForValue().set(MODE_KEY + userId, newModeStr, 1, TimeUnit.HOURS);
        redisTemplate.opsForValue().set(PLACE_KEY + userId, currentPlace, 1, TimeUnit.HOURS);

        // 6. 위치 로그 저장
        LocationLog logEntry = LocationLog.builder()
                .userId(userId)
                .latitude(lat)
                .longitude(lng)
                .matchedPlaceName(currentPlace)
                .triggeredMode(newMode)
                .build();
        em.persist(logEntry);

        // 7. 약속 장소 접근 체크
        checkScheduleProximity(userId, lat, lng);

        return LocationDto.LocationResponse.builder()
                .currentMode(newModeStr)
                .currentPlace(currentPlace)
                .aiInsight(aiInsight)
                .recommendations(recommendations)
                .build();
    }

    /**
     * Haversine 공식으로 가장 가까운 등록 장소 찾기
     */
    private Place findNearestPlace(Long userId, double lat, double lng) {
        TypedQuery<Place> query = em.createQuery(
                "SELECT p FROM Place p WHERE p.userId = :userId", Place.class);
        query.setParameter("userId", userId);
        List<Place> places = query.getResultList();

        Place nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (Place place : places) {
            double distance = haversineDistance(lat, lng, place.getLatitude(), place.getLongitude());
            double distanceMeters = distance * 1000;

            if (distanceMeters <= place.getRadiusMeters() && distanceMeters < minDistance) {
                minDistance = distanceMeters;
                nearest = place;
            }
        }

        return nearest;
    }

    /**
     * Haversine 거리 계산 (km)
     */
    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    /**
     * 모드 결정 로직
     */
    private Place.Mode determineMode(Place matchedPlace, Long userId) {
        if (matchedPlace == null) return Place.Mode.COMMUTE;
        if (matchedPlace.getLinkedMode() != null) return matchedPlace.getLinkedMode();

        // 장소 타입 기반 기본 모드
        return switch (matchedPlace.getType()) {
            case OFFICE -> Place.Mode.WORK;
            case HOME -> Place.Mode.REST;
            case CAFE -> Place.Mode.FOCUS;
            case GYM -> Place.Mode.EXERCISE;
            case RESTAURANT -> Place.Mode.MEETING;
            default -> Place.Mode.DEFAULT;
        };
    }

    /**
     * AI 맥락 분석 + 행동 추천
     */
    private String getAiRecommendation(Long userId, String place, String mode, double lat, double lng) {
        // 오늘 일정 조회
        TypedQuery<Schedule> scheduleQuery = em.createQuery(
                "SELECT s FROM Schedule s WHERE s.userId = :userId AND s.startTime >= :today AND s.startTime < :tomorrow ORDER BY s.startTime",
                Schedule.class);
        scheduleQuery.setParameter("userId", userId);
        scheduleQuery.setParameter("today", LocalDateTime.now().withHour(0).withMinute(0));
        scheduleQuery.setParameter("tomorrow", LocalDateTime.now().plusDays(1).withHour(0).withMinute(0));
        List<Schedule> todaySchedules = scheduleQuery.getResultList();

        String scheduleInfo = todaySchedules.isEmpty() ? "오늘 일정 없음" :
                todaySchedules.stream()
                        .map(s -> s.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) + " " + s.getTitle())
                        .reduce((a, b) -> a + ", " + b).orElse("");

        String prompt = """
                당신은 스마트 라이프 어시스턴트입니다. 사용자의 맥락을 분석하고 행동을 추천해주세요.
                
                [현재 상황]
                - 장소: %s
                - 모드: %s
                - 시각: %s
                - 오늘 일정: %s
                
                [요청]
                1줄 인사이트 + 3가지 구체적 행동 추천을 JSON으로 응답하세요.
                
                {"insight": "한 줄 인사이트", "actions": ["행동1", "행동2", "행동3"]}
                """.formatted(place, mode,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")),
                scheduleInfo);

        try {
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.getInterceptors().add((req, body, exec) -> {
                req.getHeaders().setBearerAuth(openAiApiKey);
                req.getHeaders().set("Content-Type", "application/json");
                return exec.execute(req, body);
            });

            Map<String, Object> request = Map.of(
                    "model", model,
                    "max_tokens", 300,
                    "temperature", 0.7,
                    "messages", List.of(
                            Map.of("role", "user", "content", prompt)
                    )
            );

            String response = restTemplate.postForObject(OPENAI_URL, request, String.class);
            JsonNode root = objectMapper.readTree(response);
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            log.error("AI 추천 실패: {}", e.getMessage());
            return "{\"insight\": \"" + place + " 모드로 전환되었습니다.\", \"actions\": []}";
        }
    }

    private List<String> parseRecommendations(String aiResponse) {
        try {
            String json = aiResponse;
            if (json.contains("```")) {
                json = json.substring(json.indexOf("{"), json.lastIndexOf("}") + 1);
            }
            JsonNode node = objectMapper.readTree(json);
            List<String> actions = new ArrayList<>();
            node.path("actions").forEach(a -> actions.add(a.asText()));
            return actions;
        } catch (Exception e) {
            return List.of();
        }
    }

    /**
     * 약속 장소 접근 시 자동 알림
     */
    private void checkScheduleProximity(Long userId, double lat, double lng) {
        TypedQuery<Schedule> query = em.createQuery(
                "SELECT s FROM Schedule s WHERE s.userId = :userId AND s.arrivalNotified = false " +
                        "AND s.latitude IS NOT NULL AND s.startTime >= :now AND s.startTime <= :soon",
                Schedule.class);
        query.setParameter("userId", userId);
        query.setParameter("now", LocalDateTime.now().minusHours(1));
        query.setParameter("soon", LocalDateTime.now().plusHours(3));

        for (Schedule schedule : query.getResultList()) {
            double distance = haversineDistance(lat, lng, schedule.getLatitude(), schedule.getLongitude());
            if (distance * 1000 <= 500) { // 500m 이내
                schedule.setArrivalNotified(true);
                em.merge(schedule);

                log.info("약속 장소 접근 알림: userId={}, schedule={}", userId, schedule.getTitle());

                // WebSocket 알림
                Map<String, String> notification = Map.of(
                        "type", "ARRIVAL_NEARBY",
                        "schedule", schedule.getTitle(),
                        "contact", schedule.getContactName() != null ? schedule.getContactName() : "",
                        "message", schedule.getContactName() + "님과의 약속 장소 근처입니다. 도착 알림을 보낼까요?"
                );
                messagingTemplate.convertAndSend("/topic/notification/" + userId, notification);
            }
        }
    }

    public String getCurrentMode(Long userId) {
        Object mode = redisTemplate.opsForValue().get(MODE_KEY + userId);
        return mode != null ? mode.toString() : "DEFAULT";
    }

    /**
     * 장소 등록
     */
    public LocationDto.PlaceResponse createPlace(LocationDto.PlaceRequest request) {
        Place place = Place.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .type(Place.PlaceType.valueOf(request.getType()))
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .radiusMeters(request.getRadiusMeters() != null ? request.getRadiusMeters() : 100)
                .linkedMode(request.getLinkedMode() != null ?
                        Place.Mode.valueOf(request.getLinkedMode()) : null)
                .build();

        em.persist(place);
        return LocationDto.PlaceResponse.from(place);
    }

    /**
     * 등록 장소 목록
     */
    @Transactional(readOnly = true)
    public List<LocationDto.PlaceResponse> getPlaces(Long userId) {
        TypedQuery<Place> query = em.createQuery(
                "SELECT p FROM Place p WHERE p.userId = :userId", Place.class);
        query.setParameter("userId", userId);
        return query.getResultList().stream()
                .map(LocationDto.PlaceResponse::from)
                .toList();
    }

    /**
     * 학습된 패턴 조회
     */
    @Transactional(readOnly = true)
    public List<LocationDto.PatternResponse> getPatterns(Long userId) {
        TypedQuery<Object[]> query = em.createQuery(
                "SELECT l.matchedPlaceName, COUNT(l), MIN(l.timestamp), MAX(l.timestamp) " +
                        "FROM LocationLog l WHERE l.userId = :userId AND l.matchedPlaceName IS NOT NULL " +
                        "GROUP BY l.matchedPlaceName ORDER BY COUNT(l) DESC",
                Object[].class);
        query.setParameter("userId", userId);

        List<LocationDto.PatternResponse> patterns = new ArrayList<>();
        for (Object[] row : query.getResultList()) {
            patterns.add(LocationDto.PatternResponse.builder()
                    .placeName((String) row[0])
                    .visitCount(((Long) row[1]).intValue())
                    .build());
        }
        return patterns;
    }
}
