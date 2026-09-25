package com.cantoalegre.api.dto.request;

import com.cantoalegre.api.domain.model.SunlightRequirement;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateBotanicalSpeciesRequest(
        @NotBlank(message = "O nome comum e obrigatorio")
        @Size(max = 150)
        String commonName,

        @NotBlank(message = "O nome cientifico e obrigatorio")
        @Size(max = 150)
        String scientificName,

        @NotNull(message = "A frequencia de rega em dias e obrigatoria")
        @Min(value = 1)
        Integer wateringFrequencyDays,

        @Min(value = 1)
        Integer wateringVolumeMl,

        @NotNull(message = "A necessidade de luz e obrigatoria")
        SunlightRequirement sunlightRequirement,

        @Size(max = 100)
        String soilType,

        String propagationGuide
) {}
