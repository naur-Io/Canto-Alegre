package com.cantoalegre.api.service;

import com.cantoalegre.api.domain.model.BotanicalSpecies;
import com.cantoalegre.api.domain.model.Plant;
import com.cantoalegre.api.domain.model.User;
import com.cantoalegre.api.domain.model.WateringLog;
import com.cantoalegre.api.dto.request.CreatePlantRequest;
import com.cantoalegre.api.dto.request.WaterPlantRequest;
import com.cantoalegre.api.dto.response.PlantResponse;
import com.cantoalegre.api.exception.ResourceNotFoundException;
import com.cantoalegre.api.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;
    private final UserService userService;
    private final BotanicalSpeciesService speciesService;

    @Transactional
    public PlantResponse createPlant(UUID guestUuid, CreatePlantRequest request) {
        User user = userService.getOrCreateGuestUser(guestUuid);

        BotanicalSpecies species = null;
        if (request.speciesId() != null) {
            species = speciesService.findEntityById(request.speciesId());
        }

        int frequencyDays = 3;
        if (request.customWateringFrequencyDays() != null) {
            frequencyDays = request.customWateringFrequencyDays();
        } else if (species != null && species.getWateringFrequencyDays() != null) {
            frequencyDays = species.getWateringFrequencyDays();
        }

        OffsetDateTime nextWatering = request.nextWateringAt() != null
                ? request.nextWateringAt()
                : OffsetDateTime.now().plusDays(frequencyDays);

        Plant plant = Plant.builder()
                .user(user)
                .species(species)
                .nickname(request.nickname())
                .customLocation(request.customLocation())
                .photoUrl(request.photoUrl())
                .nextWateringAt(nextWatering)
                .notes(request.notes())
                .build();

        return PlantResponse.fromEntity(plantRepository.save(plant));
    }

    @Transactional(readOnly = true)
    public List<PlantResponse> getPlantsByUser(UUID guestUuid) {
        User user = userService.getOrCreateGuestUser(guestUuid);
        return plantRepository.findAllByUserIdWithSpecies(user.getId())
                .stream()
                .map(PlantResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public PlantResponse getPlantById(UUID guestUuid, UUID plantId) {
        User user = userService.getOrCreateGuestUser(guestUuid);
        Plant plant = plantRepository.findByIdAndUserIdWithSpecies(plantId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Planta nao encontrada para este usuario: " + plantId));
        return PlantResponse.fromEntity(plant);
    }

    @Transactional
    public PlantResponse waterPlant(UUID guestUuid, UUID plantId, WaterPlantRequest request) {
        User user = userService.getOrCreateGuestUser(guestUuid);
        Plant plant = plantRepository.findByIdAndUserIdWithSpecies(plantId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Planta nao encontrada para este usuario: " + plantId));

        OffsetDateTime now = OffsetDateTime.now();

        WateringLog log = WateringLog.builder()
                .wateredAt(now)
                .notes(request != null ? request.notes() : null)
                .build();

        plant.addWateringLog(log);

        int frequencyDays = 3;
        if (plant.getSpecies() != null && plant.getSpecies().getWateringFrequencyDays() != null) {
            frequencyDays = plant.getSpecies().getWateringFrequencyDays();
        }
        plant.setNextWateringAt(now.plusDays(frequencyDays));

        return PlantResponse.fromEntity(plantRepository.save(plant));
    }

    @Transactional(readOnly = true)
    public List<PlantResponse> getThirstyPlants(UUID guestUuid) {
        User user = userService.getOrCreateGuestUser(guestUuid);
        return plantRepository.findThirstyPlants(user.getId(), OffsetDateTime.now())
                .stream()
                .map(PlantResponse::fromEntity)
                .toList();
    }
}
