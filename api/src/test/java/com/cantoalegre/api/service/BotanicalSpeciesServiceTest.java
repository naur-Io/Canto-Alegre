package com.cantoalegre.api.service;

import com.cantoalegre.api.domain.model.BotanicalSpecies;
import com.cantoalegre.api.domain.model.SunlightRequirement;
import com.cantoalegre.api.dto.request.CreateBotanicalSpeciesRequest;
import com.cantoalegre.api.dto.response.BotanicalSpeciesResponse;
import com.cantoalegre.api.exception.BusinessRuleException;
import com.cantoalegre.api.exception.ResourceNotFoundException;
import com.cantoalegre.api.repository.BotanicalSpeciesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BotanicalSpeciesServiceTest {

    @Mock
    private BotanicalSpeciesRepository speciesRepository;

    @Mock
    private GeminiService geminiService;

    @InjectMocks
    private BotanicalSpeciesService speciesService;

    private BotanicalSpecies species;

    @BeforeEach
    void setUp() {
        species = BotanicalSpecies.builder()
                .id(UUID.randomUUID())
                .commonName("Jiboia")
                .scientificName("Epipremnum aureum")
                .wateringFrequencyDays(3)
                .wateringVolumeMl(200)
                .sunlightRequirement(SunlightRequirement.PARTIAL_SHADE)
                .soilType("Substrato organico")
                .propagationGuide("Estaquia na agua")
                .build();
    }

    @Test
    @DisplayName("Deve buscar todas as especies quando query for nula ou vazia")
    void shouldReturnAllSpeciesWhenQueryIsEmpty() {
        when(speciesRepository.findAll()).thenReturn(List.of(species));

        List<BotanicalSpeciesResponse> results = speciesService.searchSpecies(null);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).commonName()).isEqualTo("Jiboia");
        verify(speciesRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve buscar especie por nome cientifico ou comum quando query informada")
    void shouldSearchSpeciesByQuery() {
        when(speciesRepository.findByScientificNameIgnoreCase("Epipremnum aureum"))
                .thenReturn(Optional.of(species));

        List<BotanicalSpeciesResponse> results = speciesService.searchSpecies("Epipremnum aureum");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).scientificName()).isEqualTo("Epipremnum aureum");
    }

    @Test
    @DisplayName("Deve lancar BusinessRuleException ao tentar cadastrar especie com nome cientifico duplicado")
    void shouldThrowExceptionWhenScientificNameAlreadyExists() {
        CreateBotanicalSpeciesRequest request = new CreateBotanicalSpeciesRequest(
                "Jiboia",
                "Epipremnum aureum",
                3,
                200,
                SunlightRequirement.PARTIAL_SHADE,
                "Substrato",
                "Guia"
        );

        when(speciesRepository.existsByScientificNameIgnoreCase("Epipremnum aureum")).thenReturn(true);

        assertThatThrownBy(() -> speciesService.createSpecies(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Ja existe uma especie cadastrada com este nome cientifico");

        verify(speciesRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve criar nova especie com sucesso")
    void shouldCreateSpeciesSuccessfully() {
        CreateBotanicalSpeciesRequest request = new CreateBotanicalSpeciesRequest(
                "Jiboia",
                "Epipremnum aureum",
                3,
                200,
                SunlightRequirement.PARTIAL_SHADE,
                "Substrato",
                "Guia"
        );

        when(speciesRepository.existsByScientificNameIgnoreCase("Epipremnum aureum")).thenReturn(false);
        when(speciesRepository.save(any(BotanicalSpecies.class))).thenReturn(species);

        BotanicalSpeciesResponse response = speciesService.createSpecies(request);

        assertThat(response).isNotNull();
        assertThat(response.commonName()).isEqualTo("Jiboia");
        verify(speciesRepository, times(1)).save(any(BotanicalSpecies.class));
    }

    @Test
    @DisplayName("Deve retornar especie por ID ou lancar ResourceNotFoundException")
    void shouldFindByIdOrThrowException() {
        UUID speciesId = species.getId();
        when(speciesRepository.findById(speciesId)).thenReturn(Optional.of(species));

        BotanicalSpecies found = speciesService.findEntityById(speciesId);
        assertThat(found).isNotNull();

        UUID unknownId = UUID.randomUUID();
        when(speciesRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> speciesService.findEntityById(unknownId))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
