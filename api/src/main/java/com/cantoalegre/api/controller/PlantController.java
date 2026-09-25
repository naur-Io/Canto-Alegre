package com.cantoalegre.api.controller;

import com.cantoalegre.api.dto.request.CreatePlantRequest;
import com.cantoalegre.api.dto.request.WaterPlantRequest;
import com.cantoalegre.api.dto.response.PlantResponse;
import com.cantoalegre.api.service.PlantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/plants")
@RequiredArgsConstructor
public class PlantController {

    private final PlantService plantService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlantResponse createPlant(
            @RequestHeader("X-Guest-Id") UUID guestUuid,
            @Valid @RequestBody CreatePlantRequest request) {
        return plantService.createPlant(guestUuid, request);
    }

    @GetMapping
    public List<PlantResponse> getPlants(@RequestHeader("X-Guest-Id") UUID guestUuid) {
        return plantService.getPlantsByUser(guestUuid);
    }

    @GetMapping("/{id}")
    public PlantResponse getPlantById(
            @RequestHeader("X-Guest-Id") UUID guestUuid,
            @PathVariable UUID id) {
        return plantService.getPlantById(guestUuid, id);
    }

    @PostMapping("/{id}/water")
    public PlantResponse waterPlant(
            @RequestHeader("X-Guest-Id") UUID guestUuid,
            @PathVariable UUID id,
            @RequestBody(required = false) WaterPlantRequest request) {
        return plantService.waterPlant(guestUuid, id, request);
    }

    @GetMapping("/thirsty")
    public List<PlantResponse> getThirstyPlants(@RequestHeader("X-Guest-Id") UUID guestUuid) {
        return plantService.getThirstyPlants(guestUuid);
    }
}
