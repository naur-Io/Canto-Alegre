package com.cantoalegre.api.integration;

import com.cantoalegre.api.domain.model.SunlightRequirement;
import com.cantoalegre.api.dto.request.CreateBotanicalSpeciesRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class BotanicalSpeciesControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Deve cadastrar e buscar especie botanica com PostgreSQL Testcontainers")
    void shouldCreateAndSearchBotanicalSpeciesIntegration() throws Exception {
        CreateBotanicalSpeciesRequest speciesRequest = new CreateBotanicalSpeciesRequest(
                "Costela de Adao",
                "Monstera deliciosa",
                5,
                300,
                SunlightRequirement.PARTIAL_SHADE,
                "Substrato rico e drenavel",
                "Estaquia de caule com no"
        );

        // 1. Cadastrar especie (POST /api/v1/species)
        mockMvc.perform(post("/api/v1/species")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(speciesRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.commonName").value("Costela de Adao"))
                .andExpect(jsonPath("$.scientificName").value("Monstera deliciosa"));

        // 2. Buscar especie por nome (GET /api/v1/species?search=Monstera)
        mockMvc.perform(get("/api/v1/species")
                        .param("search", "Monstera deliciosa"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].commonName").value("Costela de Adao"));

        // 3. Buscar ou enriquecer especie por nome (GET /api/v1/species/by-name?name=Costela de Adao)
        mockMvc.perform(get("/api/v1/species/by-name")
                        .param("name", "Costela de Adao"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.scientificName").value("Monstera deliciosa"));
    }
}
