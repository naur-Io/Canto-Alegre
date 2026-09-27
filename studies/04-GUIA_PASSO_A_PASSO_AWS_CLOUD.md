# Guia Passo a Passo & Infraestrutura Concluída na Nuvem AWS (Fase 3)

> **Manual detalhado da infraestrutura em nuvem implantada com sucesso na Amazon Web Services (AWS) e Render, cobrindo credenciais IAM, armazenamento de fotos no AWS S3, banco de dados gerenciado AWS RDS PostgreSQL e deploy da API Spring Boot Java 21 via Docker.**

---

## 1. Visão Geral da Infraestrutura em Produção

O ecossistema do **Canto Alegre** está 100% no ar e em produção com a seguinte arquitetura distribuída:

```
[ PWA Client (React 18 / IndexedDB) ]
                 │
                 ├── (1) Requisições REST HTTPS ──► Render Web Service (Java 21 / Docker)
                 │                                   URL: https://canto-alegre.onrender.com/api/v1
                 │                                                   │
                 │                                                   ├──► AWS RDS PostgreSQL 16.9
                 │                                                   │    Endpoint: canto-alegre-db.czisisu4ueck...
                 │                                                   │
                 └── (2) Upload de Imagens ──────────────────────────┼──► AWS S3 Bucket
                                                                          Bucket: canto-alegre-fotos-prod
```

| Serviço | Papel e Finalidade no Canto Alegre | Dados de Produção / Configuração |
| :--- | :--- | :--- |
| **AWS IAM** | Credenciais seguras (`Access Key` e `Secret Key`) para autenticação stateless da API no S3. | Usuário: `canto-alegre-backend-user` com política `AmazonS3FullAccess`. |
| **AWS S3** | Armazenamento seguro de fotos de plantas enviadas pelos usuários via upload multipart. | Bucket: `canto-alegre-fotos-prod` (Região `sa-east-1` São Paulo). |
| **AWS RDS PostgreSQL** | Banco de dados relacional gerenciado na nuvem com backups diários e Flyway Migrations. | Endpoint: `canto-alegre-db.czisisu4ueck.sa-east-1.rds.amazonaws.com` (Porta `5432`, DB `cantoalegredb`, Usuário `cantoalegreadmin`). |
| **Render Web Service** | Servidor de execução 24/7 da REST API Spring Boot 3 compilada via Docker multi-stage (Java 21). | URL Pública: `https://canto-alegre.onrender.com` |

---

## 2. Detalhamento Passo a Passo das Etapas Realizadas

### Passo 1: Configuração das Credenciais IAM na AWS
1. Acessou-se o Console AWS IAM e criou-se o usuário programático `canto-alegre-backend-user`.
2. Anexou-se a política nativa `AmazonS3FullAccess`.
3. Geraram-se as chaves `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`.
4. As credenciais foram isoladas de forma segura no arquivo local `api/.env` (adicionado ao `.gitignore` para proteção absoluta contra vazamentos).

### Passo 2: Criação e Liberação do Bucket AWS S3
1. Criou-se o bucket `canto-alegre-fotos-prod` na região `sa-east-1` (São Paulo).
2. Desbloqueou-se o acesso público de leitura e aplicou-se a **Bucket Policy** para liberação de URLs públicas de imagens:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::canto-alegre-fotos-prod/*"
    }
  ]
}
```

### Passo 3: Instância AWS RDS PostgreSQL 16.9
1. Criou-se a instância de banco de dados `canto-alegre-db` no AWS RDS sob o mecanismo PostgreSQL 16.9.
2. Nome do banco de dados relacional: `cantoalegredb`.
3. Nome do usuário administrador principal: `cantoalegreadmin`.
4. Habilitou-se o **Acesso Público (Sim)** e abriu-se a regra de tráfego de entrada na porta `5432` no Security Group `canto-alegre-rds-sg` (`0.0.0.0/0`).
5. Endpoint obtido: `canto-alegre-db.czisisu4ueck.sa-east-1.rds.amazonaws.com`.

### Passo 4: Código Java / Spring Boot para AWS S3 e CORS
1. **Bean S3Config.java**: Criou-se o bean `@Bean public S3Client s3Client()` no pacote `com.cantoalegre.api.config` habilitado para os profiles `aws` e `prod`.
2. **Serviço S3StorageService.java**: Implementou-se a interface `ImageStorageService` enviando arquivos multipart diretamente ao bucket `canto-alegre-fotos-prod` e retornando a URL HTTPS pública.
3. **Liberar CORS em SecurityConfig.java**: Adicionou-se o `CorsConfigurationSource` permitindo requisições de qualquer origem (PWA clientes web, mobile e browsers).

### Passo 5: Dockerfile Multi-Stage & Deploy no Render.com
1. Criou-se o `api/Dockerfile` utilizando build multi-stage:
   - Stage 1: `maven:3.9.6-eclipse-temurin-21-alpine` para compilação.
   - Stage 2: `eclipse-temurin:21-jre-alpine` para execução enxuta.
2. Criou-se o serviço no Render sob o runtime **Docker** com as variáveis de ambiente:
   - `DB_HOST`: `canto-alegre-db.czisisu4ueck.sa-east-1.rds.amazonaws.com`
   - `DB_NAME`: `cantoalegredb`
   - `DB_USER`: `cantoalegreadmin`
   - `DB_PASSWORD`: `${DB_PASSWORD}`
   - `AWS_ACCESS_KEY_ID`: `${AWS_ACCESS_KEY_ID}`
   - `AWS_SECRET_ACCESS_KEY`: `${AWS_SECRET_ACCESS_KEY}`
   - `AWS_S3_BUCKET`: `canto-alegre-fotos-prod`
   - `AWS_REGION`: `sa-east-1`
3. O Render efetuou o deploy automático, executou as migrações Flyway `V1` e `V2` no AWS RDS e disponibilizou a API REST pública em `https://canto-alegre.onrender.com`.

---

## 3. Checklist de Validação em Produção

- [x] **Testes Automatizados Backend**: 20/20 testes unitários e de integração com Testcontainers aprovados (`./mvnw test`).
- [x] **Migrações de Banco de Dados**: Flyway executou `DbValidate` e `DbMigrate` (versão atual do schema "public": 2).
- [x] **Conexão AWS RDS**: Spring Boot conectado com sucesso ao PostgreSQL 16.9 na porta `5432`.
- [x] **CORS e URLs Públicas**: API acessível publicamente com HTTPS habilitado no Render.
