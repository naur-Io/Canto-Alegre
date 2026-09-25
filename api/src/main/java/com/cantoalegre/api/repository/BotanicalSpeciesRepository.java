package com.cantoalegre.api.repository;

import com.cantoalegre.api.domain.model.BotanicalSpecies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BotanicalSpeciesRepository extends JpaRepository<BotanicalSpecies, UUID> {
    Optional<BotanicalSpecies> findByScientificNameIgnoreCase(String scientificName);
    Optional<BotanicalSpecies> findByCommonNameIgnoreCase(String commonName);
    boolean existsByScientificNameIgnoreCase(String scientificName);
}