package com.bomin.locationagent.controller;

import com.bomin.locationagent.dto.LocationDto;
import com.bomin.locationagent.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Location Agent API", description = "위치 기반 AI 자동화 API")
public class LocationController {

    private final LocationService locationService;

    @PostMapping("/location/update")
    @Operation(summary = "위치 업데이트", description = "모바일에서 위치를 전송하면 AI가 모드를 분석합니다")
    public ResponseEntity<LocationDto.LocationResponse> updateLocation(
            @Valid @RequestBody LocationDto.UpdateRequest request) {
        return ResponseEntity.ok(locationService.updateLocation(request));
    }

    @GetMapping("/location/current-mode")
    @Operation(summary = "현재 모드 조회")
    public ResponseEntity<Map<String, String>> getCurrentMode(@RequestParam Long userId) {
        String mode = locationService.getCurrentMode(userId);
        return ResponseEntity.ok(Map.of("mode", mode, "userId", userId.toString()));
    }

    @PostMapping("/places")
    @Operation(summary = "장소 등록", description = "회사, 집, 카페 등 장소를 등록합니다")
    public ResponseEntity<LocationDto.PlaceResponse> createPlace(
            @Valid @RequestBody LocationDto.PlaceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(locationService.createPlace(request));
    }

    @GetMapping("/places")
    @Operation(summary = "등록 장소 목록")
    public ResponseEntity<List<LocationDto.PlaceResponse>> getPlaces(@RequestParam Long userId) {
        return ResponseEntity.ok(locationService.getPlaces(userId));
    }

    @GetMapping("/patterns")
    @Operation(summary = "학습된 패턴 조회")
    public ResponseEntity<List<LocationDto.PatternResponse>> getPatterns(@RequestParam Long userId) {
        return ResponseEntity.ok(locationService.getPatterns(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "OK", "service", "ai-location-agent"));
    }
}
