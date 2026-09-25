package com.cantoalegre.api.service;

import com.cantoalegre.api.domain.model.User;
import com.cantoalegre.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User getOrCreateGuestUser(UUID guestUuid) {
        return userRepository.findByGuestUuid(guestUuid)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .guestUuid(guestUuid)
                                .name("Guest User")
                                .build()
                ));
    }
}
