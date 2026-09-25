package com.cantoalegre.api.service;

import com.cantoalegre.api.domain.model.BotanicalSpecies;
import com.cantoalegre.api.domain.model.Plant;
import com.cantoalegre.api.domain.model.SunlightRequirement;
import com.cantoalegre.api.domain.model.User;
import com.cantoalegre.api.dto.request.CreatePlantRequest;
import com.cantoalegre.api.dto.request.WaterPlantRequest;
import com.cantoalegre.api.dto.response.PlantResponse;
import com.cantoalegre.api.exception.ResourceNotFoundException;
import com.cantoalegre.api.repository.PlantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlantServiceTest {

    @Mock
    private PlantRepository plantRepository;

    @Mock
    private UserService userService;

    @Mock
    private BotanicalSpeciesService speciesService;

    @InjectMocks
    private PlantService plantService;

    private UUID guestUuid;
    private User user;
    private BotanicalSpecies species;
    private Plant plant;

    @BeforeEach
    void setUp() {
        guestUuid = UUID.randomUUID();
        user = User.builder()
                .id(UUID.randomUUID())
                .guestUuid(guestUuid)
                .name("Guest User")
                .build();

        species = BotanicalSpecies.builder()
                .id(UUID.randomUUID())
                .commonName("Jiboia")
                .scientificName("Epipremnum aureum")
                .wateringFrequencyDays(3)
                .wateringVolumeMl(200)
                .sunlightRequirement(SunlightRequirement.PARTIAL_SHADE)
                .build();

        plant = Plant.builder()
                .id(UUID.randomUUID())
                .user(user)
                .species(species)
                .nickname("Minha Jiboia")
                .customLocation("Varanda")
                .nextWateringAt(OffsetDateTime.now().plusDays(3))
                .build();
    }

    @Test
    @DisplayName("Deve criar planta com sucesso associando ao usuario guest")
    void shouldCreatePlantSuccessfully() {
        CreatePlantRequest request = new CreatePlantRequest(
                "Minha Jiboia",
                species.getId(),
                "Varanda",
                null,
                null,
                null,
                "Aprecia sombra"
        );

        when(userService.getOrCreateGuestUser(guestUuid)).thenReturn(user);
        when(speciesService.findEntityById(species.getId())).thenReturn(species);
        when(plantRepository.save(any(Plant.class))).thenReturn(plant);

        PlantResponse response = plantService.createPlant(guestUuid, request);

        assertThat(response).isNotNull();
        assertThat(response.nickname()).isEqualTo("Minha Jiboia");
        verify(plantRepository, times(1)).save(any(Plant.class));
    }

    @Test
    @DisplayName("Deve buscar todas as plantas do usuario")
    void shouldGetPlantsByUser() {
        when(userService.getOrCreateGuestUser(guestUuid)).thenReturn(user);
        when(plantRepository.findAllByUserIdWithSpecies(user.getId())).thenReturn(List.of(plant));

        List<PlantResponse> response = plantService.getPlantsByUser(guestUuid);

        assertThat(response).hasSize(1);
        assertThat(response.get(0).nickname()).isEqualTo("Minha Jiboia");
        verify(plantRepository, times(1)).findAllByUserIdWithSpecies(user.getId());
    }

    @Test
    @DisplayName("Deve registrar rega na planta e atualizar proxima rega")
    void shouldWaterPlantSuccessfully() {
        UUID plantId = plant.getId();
        WaterPlantRequest waterRequest = new WaterPlantRequest("Regada de manha");

        when(userService.getOrCreateGuestUser(guestUuid)).thenReturn(user);
        when(plantRepository.findByIdAndUserIdWithSpecies(plantId, user.getId()))
                .thenReturn(Optional.of(plant));
        when(plantRepository.save(any(Plant.class))).thenReturn(plant);

        PlantResponse response = plantService.waterPlant(guestUuid, plantId, waterRequest);

        assertThat(response).isNotNull();
        verify(plantRepository, times(1)).save(plant);
        assertThat(plant.getWateringLogs()).hasSize(1);
    }

    @Test
    @DisplayName("Deve lancar ResourceNotFoundException ao tentar regar planta inexistente do usuario")
    void shouldThrowExceptionWhenWateringNonExistingPlant() {
        UUID unknownId = UUID.randomUUID();

        when(userService.getOrCreateGuestUser(guestUuid)).thenReturn(user);
        when(plantRepository.findByIdAndUserIdWithSpecies(unknownId, user.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> plantService.waterPlant(guestUuid, unknownId, null))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Planta nao encontrada para este usuario");
    }

    @Test
    @DisplayName("Deve buscar plantas com sede do usuario")
    void shouldGetThirstyPlants() {
        when(userService.getOrCreateGuestUser(guestUuid)).thenReturn(user);
        when(plantRepository.findThirstyPlants(eq(user.getId()), any())).thenReturn(List.of(plant));

        List<PlantResponse> response = plantService.getThirstyPlants(guestUuid);

        assertThat(response).hasSize(1);
        verify(plantRepository, times(1)).findThirstyPlants(eq(user.getId()), any());
    }
}
