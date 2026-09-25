package com.cantoalegre.api.dto.request;

import jakarta.validation.constraints.Size;

public record WaterPlantRequest(
        @Size(max = 255, message = "As notas de rega devem ter no maximo 255 caracteres")
        String notes
) {}
