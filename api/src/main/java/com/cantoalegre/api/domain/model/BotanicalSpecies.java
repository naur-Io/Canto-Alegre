package com.cantoalegre.api.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "botanical_species")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class BotanicalSpecies {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "common_name", nullable = false, length = 150)
    private String commonName;

    @Column(name = "scientific_name", nullable = false, unique = true, length = 150)
    private String scientificName;

    @Column(name = "watering_frequency_days", nullable = false)
    private Integer wateringFrequencyDays;

    @Column(name = "watering_volume_ml")
    private Integer wateringVolumeMl;

    @Enumerated(EnumType.STRING)
    @Column(name = "sunlight_requirement", nullable = false, length = 50)
    private SunlightRequirement sunlightRequirement;

    @Column(name = "soil_type", length = 100)
    private String soilType;

    @Column(name = "propagation_guide", columnDefinition = "TEXT")
    private String propagationGuide;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}