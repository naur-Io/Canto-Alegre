package com.cantoalegre.api.service;

import com.cantoalegre.api.domain.model.User;
import com.cantoalegre.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private UUID guestUuid;

    @BeforeEach
    void setUp() {
        guestUuid = UUID.randomUUID();
    }

    @Test
    @DisplayName("Deve retornar usuario existente quando guestUuid for encontrado no banco")
    void shouldReturnExistingUserWhenGuestUuidExists() {
        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .guestUuid(guestUuid)
                .name("Guest User")
                .build();

        when(userRepository.findByGuestUuid(guestUuid)).thenReturn(Optional.of(existingUser));

        User result = userService.getOrCreateGuestUser(guestUuid);

        assertThat(result).isNotNull();
        assertThat(result.getGuestUuid()).isEqualTo(guestUuid);
        verify(userRepository, times(1)).findByGuestUuid(guestUuid);
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve criar e salvar novo usuario quando guestUuid nao for encontrado")
    void shouldCreateNewUserWhenGuestUuidDoesNotExist() {
        User savedUser = User.builder()
                .id(UUID.randomUUID())
                .guestUuid(guestUuid)
                .name("Guest User")
                .build();

        when(userRepository.findByGuestUuid(guestUuid)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.getOrCreateGuestUser(guestUuid);

        assertThat(result).isNotNull();
        assertThat(result.getGuestUuid()).isEqualTo(guestUuid);
        verify(userRepository, times(1)).findByGuestUuid(guestUuid);
        verify(userRepository, times(1)).save(any(User.class));
    }
}
