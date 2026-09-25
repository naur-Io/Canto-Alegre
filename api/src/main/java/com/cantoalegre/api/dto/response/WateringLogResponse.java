package com.cantoalegre.api.dto.response;

import com.cantoalegre.api.domain.model.WateringLog;

import java.time.OffsetDateTime;
import java.util.UUID;

public record WateringLogResponse(
        UUID id,
        OffsetDateTime wateredAt,
        String notes
) {
    public static WateringLogResponse fromEntity(WateringLog log) {
        return new WateringLogResponse(
                log.getId(),
                log.getWateredAt(),
                log.getNotes()
        );
    }
}
