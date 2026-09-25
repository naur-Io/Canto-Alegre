package com.cantoalegre.api.dto.response;

import com.cantoalegre.api.domain.model.BotanicalSpecies;
import com.cantoalegre.api.domain.model.SunlightRequirement;

import java.time.OffsetDateTime;
import java.util.UUID;

public record BotanicalSpeciesResponse(
        UUID id,
        String commonName,
        String scientificName,
        Integer wateringFrequencyDays,
        Integer wateringVolumeMl,
        SunlightRequirement sunlightRequirement,
        String soilType,
        String propagationGuide,
        OffsetDateTime createdAt
) {
    public static BotanicalSpeciesResponse fromEntity(BotanicalSpecies species) {
        if (species == null) return null;
        return new BotanicalSpeciesResponse(
                species.getId(),
                species.getCommonName(),
                species.getScientificName(),
                species.getWateringFrequencyDays(),
                species.getWateringVolumeMl(),
                species.getSunlightRequirement(),
                species.getSoilType(),
                species.getPropagationGuide(),
                species.getCreatedAt()
        );
    }
}
