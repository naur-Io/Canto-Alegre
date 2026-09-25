package com.cantoalegre.api.repository;

import com.cantoalegre.api.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByGuestUuid(UUID guestUuid);
    Optional<User> findByEmail(String email);
}