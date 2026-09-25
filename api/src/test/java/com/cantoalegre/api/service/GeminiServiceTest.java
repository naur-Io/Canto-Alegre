package com.cantoalegre.api.service;

import com.cantoalegre.api.domain.model.SunlightRequirement;
import com.cantoalegre.api.dto.request.CreateBotanicalSpeciesRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GeminiServiceTest {

    private GeminiService geminiService;

    @BeforeEach
    void setUp() {
        ObjectMapper objectMapper = new ObjectMapper();
        geminiService = new GeminiService(objectMapper);
    }

    @Test
    @DisplayName("Deve gerar dados de fallback de especie quando a chave de API estiver ausente")
    void shouldGenerateFallbackSpeciesDataWhenApiKeyIsMissing() {
        CreateBotanicalSpeciesRequest result = geminiService.generateBotanicalSpeciesInfo("Manjericao");

        assertThat(result).isNotNull();
        assertThat(result.commonName()).isEqualTo("Manjericao");
        assertThat(result.scientificName()).contains("Manjericao");
        assertThat(result.wateringFrequencyDays()).isGreaterThan(0);
        assertThat(result.sunlightRequirement()).isNotNull();
    }

    @Test
    @DisplayName("Deve adaptar fallback para suculentas com Sol Pleno e menor rega")
    void shouldAdaptFallbackForSucculents() {
        CreateBotanicalSpeciesRequest result = geminiService.generateBotanicalSpeciesInfo("Suculenta Echeveria");

        assertThat(result).isNotNull();
        assertThat(result.sunlightRequirement()).isEqualTo(SunlightRequirement.FULL_SUN);
        assertThat(result.wateringFrequencyDays()).isEqualTo(7);
        assertThat(result.wateringVolumeMl()).isEqualTo(100);
    }
}
