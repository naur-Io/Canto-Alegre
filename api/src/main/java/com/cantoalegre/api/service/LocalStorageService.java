package com.cantoalegre.api.service;

import com.cantoalegre.api.exception.BusinessRuleException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class LocalStorageService implements ImageStorageService {

    private final Path uploadLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public LocalStorageService() {
        try {
            Files.createDirectories(this.uploadLocation);
        } catch (IOException e) {
            log.error("Nao foi possivel criar o diretorio de uploads local: {}", e.getMessage());
        }
    }

    @Override
    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessRuleException("Selecione um arquivo de imagem valido para upload.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessRuleException("Formato de arquivo invalido. Envie apenas imagens (JPEG, PNG, WebP).");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "plant.jpg");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf(".");
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex);
        } else {
            extension = ".jpg";
        }

        String uniqueFilename = UUID.randomUUID() + extension;
        Path targetLocation = this.uploadLocation.resolve(uniqueFilename);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("Foto da planta salva com sucesso no disco: {}", targetLocation);
            return "/uploads/" + uniqueFilename;
        } catch (IOException e) {
            throw new BusinessRuleException("Falha ao salvar o arquivo de imagem no servidor: " + e.getMessage());
        }
    }
}
