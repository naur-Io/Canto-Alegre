package com.cantoalegre.api.controller;

import com.cantoalegre.api.dto.request.CreateBotanicalSpeciesRequest;
import com.cantoalegre.api.dto.response.BotanicalSpeciesResponse;
import com.cantoalegre.api.service.BotanicalSpeciesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/species", "/api/v1/botanical-species"})
@RequiredArgsConstructor
public class BotanicalSpeciesController {

    private final BotanicalSpeciesService speciesService;

    @GetMapping
    public List<BotanicalSpeciesResponse> searchSpecies(@RequestParam(required = false) String search) {
        return speciesService.searchSpecies(search);
    }

    @GetMapping("/by-name")
    public BotanicalSpeciesResponse getOrCreateByName(@RequestParam String name) {
        return speciesService.getOrCreateSpeciesByName(name);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BotanicalSpeciesResponse createSpecies(@Valid @RequestBody CreateBotanicalSpeciesRequest request) {
        return speciesService.createSpecies(request);
    }
}
