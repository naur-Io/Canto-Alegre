CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Catálogo canônico de espécies botânicas (Cache de conhecimento & LLM enrichment)
CREATE TABLE botanical_species (
                                   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                   common_name VARCHAR(150) NOT NULL,
                                   scientific_name VARCHAR(150) NOT NULL UNIQUE,
                                   watering_frequency_days INTEGER NOT NULL CHECK (watering_frequency_days > 0),
                                   watering_volume_ml INTEGER CHECK (watering_volume_ml > 0),
                                   sunlight_requirement VARCHAR(50) NOT NULL, -- FULL_SUN, PARTIAL_SHADE, FULL_SHADE
                                   soil_type VARCHAR(100),
                                   propagation_guide TEXT,
                                   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Usuários (Suporte a Guest Mode e Contas Google)
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       email VARCHAR(150) UNIQUE,
                       name VARCHAR(150),
                       provider_id VARCHAR(100) UNIQUE, -- Google sub ID
                       guest_uuid UUID UNIQUE,          -- Identificador anônimo do PWA antes do login
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Plantas do Usuário (O Jardim)
CREATE TABLE plants (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        user_id UUID NOT NULL,
                        species_id UUID,
                        nickname VARCHAR(100) NOT NULL,
                        custom_location VARCHAR(100),    -- Ex: "Varanda", "Sala", "Canteiro 1"
                        photo_url TEXT,
                        last_watered_at TIMESTAMP WITH TIME ZONE,
                        next_watering_at TIMESTAMP WITH TIME ZONE NOT NULL,
                        notes TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_plants_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                        CONSTRAINT fk_plants_species FOREIGN KEY (species_id) REFERENCES botanical_species(id) ON DELETE SET NULL
);

-- 4. Diário & Histórico de Regas
CREATE TABLE watering_logs (
                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               plant_id UUID NOT NULL,
                               watered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               notes VARCHAR(255),
                               CONSTRAINT fk_watering_plant FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

-- Índices para buscas frequentes e otimização de queries
CREATE INDEX idx_species_scientific_name ON botanical_species(scientific_name);
CREATE INDEX idx_species_common_name ON botanical_species(common_name);
CREATE INDEX idx_plants_user_id ON plants(user_id);
CREATE INDEX idx_plants_next_watering_at ON plants(next_watering_at);
CREATE INDEX idx_watering_logs_plant_id ON watering_logs(plant_id);