package com.cantoalegre.api.repository;


import com.cantoalegre.api.domain.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlantRepository extends JpaRepository<Plant, UUID> {

    @Query("SELECT p FROM Plant p " +
            "LEFT JOIN FETCH p.species " +
            "WHERE p.user.id = :userId")
    List<Plant> findAllByUserIdWithSpecies(@Param("userId") UUID userId);

    @Query("SELECT p FROM Plant p " +
            "LEFT JOIN FETCH p.species " +
            "WHERE p.id = :id AND p.user.id = :userId")
    Optional<Plant> findByIdAndUserIdWithSpecies(@Param("id") UUID id, @Param("userId") UUID userId);

    @Query("SELECT p FROM Plant p " +
            "WHERE p.user.id = :userId AND p.nextWateringAt <= :limitDate")
    List<Plant> findThirstyPlants(@Param("userId") UUID userId, @Param("limitDate") OffsetDateTime limitDate);
}