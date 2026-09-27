package com.cantoalegre.api.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    /**
     * Salva uma imagem recebida via upload multipart e retorna a URL pública/relativa para acesso.
     *
     * @param file arquivo multipart de imagem
     * @return URL do arquivo armazenado
     */
    String storeImage(MultipartFile file);
}
