package com.cantoalegre.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CreatePlantRequest(
        @NotBlank(message = "O apelido da planta e obrigatorio")
        @Size(max = 100, message = "O apelido deve ter no maximo 100 caracteres")
        String nickname,

        UUID speciesId,

        @Size(max = 100, message = "A localizacao deve ter no maximo 100 caracteres")
        String customLocation,

        @Size(max = 150, message = "O ambiente ideal deve ter no maximo 150 caracteres")
        String idealEnvironment,

        String photoUrl,

        @Min(value = 1, message = "A frequencia de rega deve ser de no minimo 1 dia")
        Integer customWateringFrequencyDays,

        OffsetDateTime nextWateringAt,

        String notes
) {}
