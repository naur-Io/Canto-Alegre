package com.cantoalegre.api.dto.response;

import com.cantoalegre.api.domain.model.Plant;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PlantResponse(
        UUID id,
        String nickname,
        String customLocation,
        String photoUrl,
        OffsetDateTime lastWateredAt,
        OffsetDateTime nextWateringAt,
        String notes,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        BotanicalSpeciesResponse species
) {
    public static PlantResponse fromEntity(Plant plant) {
        return new PlantResponse(
                plant.getId(),
                plant.getNickname(),
                plant.getCustomLocation(),
                plant.getPhotoUrl(),
                plant.getLastWateredAt(),
                plant.getNextWateringAt(),
                plant.getNotes(),
                plant.getCreatedAt(),
                plant.getUpdatedAt(),
                BotanicalSpeciesResponse.fromEntity(plant.getSpecies())
        );
    }
}
