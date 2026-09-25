package com.cantoalegre.api.service;

import com.cantoalegre.api.domain.model.BotanicalSpecies;
import com.cantoalegre.api.dto.request.CreateBotanicalSpeciesRequest;
import com.cantoalegre.api.dto.response.BotanicalSpeciesResponse;
import com.cantoalegre.api.exception.BusinessRuleException;
import com.cantoalegre.api.exception.ResourceNotFoundException;
import com.cantoalegre.api.repository.BotanicalSpeciesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BotanicalSpeciesService {

    private final BotanicalSpeciesRepository speciesRepository;
    private final GeminiService geminiService;

    @Transactional(readOnly = true)
    public List<BotanicalSpeciesResponse> searchSpecies(String query) {
        if (query == null || query.isBlank()) {
            return speciesRepository.findAll().stream()
                    .map(BotanicalSpeciesResponse::fromEntity)
                    .toList();
        }
        return speciesRepository.findByScientificNameIgnoreCase(query)
                .or(() -> speciesRepository.findByCommonNameIgnoreCase(query))
                .stream()
                .map(BotanicalSpeciesResponse::fromEntity)
                .toList();
    }

    @Transactional
    public BotanicalSpeciesResponse getOrCreateSpeciesByName(String plantName) {
        return speciesRepository.findByCommonNameIgnoreCase(plantName)
                .or(() -> speciesRepository.findByScientificNameIgnoreCase(plantName))
                .map(BotanicalSpeciesResponse::fromEntity)
                .orElseGet(() -> {
                    CreateBotanicalSpeciesRequest request = geminiService.generateBotanicalSpeciesInfo(plantName);
                    return createSpecies(request);
                });
    }

    @Transactional
    public BotanicalSpeciesResponse createSpecies(CreateBotanicalSpeciesRequest request) {
        if (speciesRepository.existsByScientificNameIgnoreCase(request.scientificName())) {
            throw new BusinessRuleException("Ja existe uma especie cadastrada com este nome cientifico.");
        }
        BotanicalSpecies species = BotanicalSpecies.builder()
                .commonName(request.commonName())
                .scientificName(request.scientificName())
                .wateringFrequencyDays(request.wateringFrequencyDays())
                .wateringVolumeMl(request.wateringVolumeMl())
                .sunlightRequirement(request.sunlightRequirement())
                .soilType(request.soilType())
                .propagationGuide(request.propagationGuide())
                .build();

        return BotanicalSpeciesResponse.fromEntity(speciesRepository.save(species));
    }

    @Transactional(readOnly = true)
    public BotanicalSpecies findEntityById(UUID id) {
        return speciesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Especie botanica nao encontrada com o ID: " + id));
    }
}
