package com.bomin.locationagent.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    private String description;

    private String location;
    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String contactName;  // 약속 상대방
    private String contactPhone; // 상대방 연락처

    @Builder.Default
    private boolean arrivalNotified = false; // 도착 알림 발송 여부

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
