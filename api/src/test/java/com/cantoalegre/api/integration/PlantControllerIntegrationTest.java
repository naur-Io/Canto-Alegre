package com.cantoalegre.api.integration;

import com.cantoalegre.api.dto.request.CreatePlantRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PlantControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Deve criar, listar e regar planta via API REST com PostgreSQL Testcontainers")
    void shouldCreateListAndWaterPlantIntegration() throws Exception {
        UUID guestId = UUID.randomUUID();

        CreatePlantRequest createRequest = new CreatePlantRequest(
                "Jiboia da Varanda",
                null,
                "Varanda Principal",
                "http://example.com/photo.jpg",
                4,
                null,
                "Luz difusa"
        );

        // 1. Criar Planta (POST /api/v1/plants)
        String responseContent = mockMvc.perform(post("/api/v1/plants")
                        .header("X-Guest-Id", guestId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nickname").value("Jiboia da Varanda"))
                .andExpect(jsonPath("$.customLocation").value("Varanda Principal"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String createdPlantId = objectMapper.readTree(responseContent).get("id").asText();

        // 2. Listar Plantas do Usuario (GET /api/v1/plants)
        mockMvc.perform(get("/api/v1/plants")
                        .header("X-Guest-Id", guestId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].nickname").value("Jiboia da Varanda"));

        // 3. Regar Planta (POST /api/v1/plants/{id}/water)
        mockMvc.perform(post("/api/v1/plants/" + createdPlantId + "/water")
                        .header("X-Guest-Id", guestId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastWateredAt").exists());
    }
}
