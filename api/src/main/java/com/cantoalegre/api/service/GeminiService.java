package com.cantoalegre.api.service;

import com.cantoalegre.api.domain.model.SunlightRequirement;
import com.cantoalegre.api.dto.request.CreateBotanicalSpeciesRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Service
public class GeminiService {

    @Value("${gemini.api-key:}")
    private String apiKey;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeminiService(ObjectMapper objectMapper) {
        this.restClient = RestClient.create();
        this.objectMapper = objectMapper;
    }

    public CreateBotanicalSpeciesRequest generateBotanicalSpeciesInfo(String plantName) {
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                return callGeminiApi(plantName);
            } catch (Exception e) {
                log.warn("Falha ao consultar API Gemini para a planta {}: {}. Usando gerador de fallback.", plantName, e.getMessage());
            }
        }
        return generateFallbackSpecies(plantName);
    }

    private CreateBotanicalSpeciesRequest callGeminiApi(String plantName) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        String prompt = String.format("""
                Voce e um taxonomista e botanico especialista.
                Gere os dados botanicos exatos para a planta chamada "%s".
                Retorne ESTRITAMENTE um JSON com os seguintes campos:
                {
                  "commonName": "%s",
                  "scientificName": "Nome Cientifico Binomial em Latim",
                  "wateringFrequencyDays": 3,
                  "wateringVolumeMl": 200,
                  "sunlightRequirement": "FULL_SUN" | "PARTIAL_SHADE" | "FULL_SHADE",
                  "soilType": "Descricao do substrato",
                  "propagationGuide": "Guia de propagacao e mudas"
                }
                """, plantName, plantName);

        Map<String, Object> body = Map.of(
                "contents", java.util.List.of(
                        Map.of("parts", java.util.List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        String responseBody = restClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);

        JsonNode rootNode = objectMapper.readTree(responseBody);
        String textOutput = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        String jsonText = textOutput;
        int startIndex = textOutput.indexOf("{");
        int endIndex = textOutput.lastIndexOf("}");
        if (startIndex >= 0 && endIndex > startIndex) {
            jsonText = textOutput.substring(startIndex, endIndex + 1);
        }

        JsonNode jsonNode = objectMapper.readTree(jsonText);

        String commonName = jsonNode.path("commonName").asText(plantName);
        String scientificName = jsonNode.path("scientificName").asText(plantName + " sp.");
        int frequencyDays = jsonNode.path("wateringFrequencyDays").asInt(3);
        int volumeMl = jsonNode.path("wateringVolumeMl").asInt(200);
        String sunlightStr = jsonNode.path("sunlightRequirement").asText("PARTIAL_SHADE");
        String soilType = jsonNode.path("soilType").asText("Substrato rico em materia organica e bem drenado");
        String propagationGuide = jsonNode.path("propagationGuide").asText("Estaquia de caule em substrato leve ou agua.");

        SunlightRequirement sunlightRequirement;
        try {
            sunlightRequirement = SunlightRequirement.valueOf(sunlightStr.toUpperCase());
        } catch (Exception e) {
            sunlightRequirement = SunlightRequirement.PARTIAL_SHADE;
        }

        return new CreateBotanicalSpeciesRequest(
                commonName,
                scientificName,
                frequencyDays,
                volumeMl,
                sunlightRequirement,
                soilType,
                propagationGuide
        );
    }

    private CreateBotanicalSpeciesRequest generateFallbackSpecies(String plantName) {
        String nameLower = plantName.toLowerCase();
        SunlightRequirement sunlight = SunlightRequirement.PARTIAL_SHADE;
        int frequencyDays = 3;
        int volumeMl = 200;
        String soil = "Substrato organico aerado e bem drenado";
        String propagation = "Estaquia de ramos ou divisao de touceira na primavera";

        if (nameLower.contains("suculenta") || nameLower.contains("cacto") || nameLower.contains("espada")) {
            sunlight = SunlightRequirement.FULL_SUN;
            frequencyDays = 7;
            volumeMl = 100;
            soil = "Substrato arenoso com excelente drenagem";
            propagation = "Estaquia de folha ou divisao de touceira";
        } else if (nameLower.contains("samambaia") || nameLower.contains("avenca")) {
            sunlight = SunlightRequirement.FULL_SHADE;
            frequencyDays = 2;
            volumeMl = 250;
            soil = "Substrato rico em fibra de coco e materia organica";
            propagation = "Divisao de touceira em ambiente umido";
        }

        return new CreateBotanicalSpeciesRequest(
                plantName,
                plantName.substring(0, 1).toUpperCase() + plantName.substring(1).toLowerCase() + " spp.",
                frequencyDays,
                volumeMl,
                sunlight,
                soil,
                propagation
        );
    }
}
