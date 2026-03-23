package com.bomin.locationagent.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "places")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name; // "회사", "집", "헬스장" 등

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlaceType type;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Builder.Default
    private Integer radiusMeters = 100; // 진입 감지 반경

    @Enumerated(EnumType.STRING)
    private Mode linkedMode; // 이 장소 진입 시 전환할 모드

    private String customAction; // 사용자 정의 행동 (JSON)

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PlaceType {
        HOME, OFFICE, CAFE, GYM, RESTAURANT, SCHOOL, CUSTOM
    }

    public enum Mode {
        WORK,       // 출근 모드
        FOCUS,      // 집중 모드
        REST,       // 휴식 모드
        EXERCISE,   // 운동 모드
        COMMUTE,    // 이동 모드
        MEETING,    // 약속 모드
        DEFAULT     // 기본
    }
}
