package com.bomin.locationagent.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "location_logs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LocationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String matchedPlaceName; // 매칭된 장소

    @Enumerated(EnumType.STRING)
    private Place.Mode triggeredMode;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
