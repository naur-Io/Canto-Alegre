# Guia Passo a Passo: Implantação e Configuração na Nuvem AWS (Fase 3)

> **Manual detalhado para configuração de infraestrutura em nuvem na Amazon Web Services (AWS), cobrindo credenciais IAM, armazenamento de fotos no AWS S3, banco de dados gerenciado AWS RDS PostgreSQL e deploy da API Spring Boot.**

---

## 1. Visão Geral dos Serviços AWS Utilizados

Para colocar o projeto **Canto Alegre** em produção com alta disponibilidade, utilizaremos 4 serviços principais da AWS:

| Serviço AWS | Finalidade no Canto Alegre | Alternativa Gratuita / Simplificada |
| :--- | :--- | :--- |
| **AWS IAM (Identity & Access Management)** | Gestão de chaves de acesso (`Access Key` e `Secret Key`) para que o Spring Boot se comunique com a AWS com segurança. | Não se aplica (Nativo AWS) |
| **AWS S3 (Simple Storage Service)** | Armazenamento de fotos de plantas enviadas pelos usuários via upload multipart. | Cloudinary / Supabase Storage |
| **AWS RDS (Relational Database Service)** | Banco de dados PostgreSQL 16 gerenciado na nuvem com backups automáticos. | Render PostgreSQL / Neon.tech |
| **AWS App Runner / Elastic Beanstalk** | Servidor para executar a REST API Spring Boot Java 21 (`.jar`) em execução 24/7. | Render / Railway / Fly.io |
| **AWS Amplify / S3 + CloudFront** | Hospedagem do frontend PWA React em URL pública com HTTPS automático. | Vercel / Netlify |

---

## 2. Passo a Passo Completo: Onde Clicar e Como Configurar

### Passo 1: Criar Conta AWS e Obter Credenciais IAM

1. **Acessar a AWS**: Acesse o site oficial em `https://aws.amazon.com/` e clique no botão no canto superior direito **"Criar uma conta da AWS"** (*Create an AWS Account*).
2. **Acessar o Painel IAM**:
   - No campo de busca superior do Console AWS, digite **IAM** e clique no serviço **IAM**.
3. **Criar Usuário Programático**:
   - No menu lateral esquerdo, clique em **Usuários** (*Users*) e depois em **Criar usuário** (*Create user*).
   - Nome do Usuário: `canto-alegre-backend-user`.
   - Clique em **Próximo** (*Next*).
4. **Atribuir Permissões**:
   - Selecionar a opção **Anexar políticas diretamente** (*Attach policies directly*).
   - Pesquisar e selecionar as seguintes políticas:
     - `AmazonS3FullAccess` (para permissão de upload/leitura de fotos no S3).
   - Clique em **Próximo** e depois em **Criar usuário**.
5. **Gerar Access Key & Secret Key**:
   - Clique no usuário recém-criado `canto-alegre-backend-user`.
   - Vá para a aba **Credenciais de segurança** (*Security credentials*).
   - Role até a seção **Chaves de acesso** (*Access keys*) e clique em **Criar chave de acesso** (*Create access key*).
   - Selecione a opção **Código executado fora da AWS** (*Application running outside AWS*).
   - Clique em **Próximo** -> **Criar chave de acesso**.
   - **IMPORTANTE**: Copie e guarde em local seguro a **Access Key ID** e a **Secret Access Key** (a Secret Key só é exibida uma única vez).

---

### Passo 2: Criar o Bucket no AWS S3 (Armazenamento de Imagens)

1. **Acessar o S3**:
   - Na barra de busca superior do Console AWS, digite **S3** e clique no serviço **S3**.
2. **Criar um Bucket**:
   - Clique no botão laranja **Criar bucket** (*Create bucket*).
   - **Nome do bucket**: `canto-alegre-fotos-prod` (deve ser em letras minúsculas e único globalmente).
   - **Região da AWS**: Escolha `sa-east-1` (América do Sul / São Paulo) ou `us-east-1` (Norte da Virgínia).
   - **Propriedade do objeto**: Manter *ACLs desabilitadas (recomendado)*.
   - **Bloqueio de acesso público**:
     - Desmarque a opção *Bloquear todo o acesso público* (*Block all public access*) se desejar servir imagens publicamente via URL direta do S3, e marque a caixa de confirmação.
   - Clique no botão **Criar bucket** no final da página.
3. **Configurar Política de Acesso Público ao Bucket (Bucket Policy)**:
   - Clique no nome do bucket `canto-alegre-fotos-prod`.
   - Acesse a aba **Permissões** (*Permissions*).
   - Na seção **Política do bucket** (*Bucket policy*), clique em **Editar** e cole o seguinte JSON (substituindo pelo nome do seu bucket):

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

---

### Passo 3: Criar o Banco de Dados PostgreSQL no AWS RDS

1. **Acessar o RDS**:
   - Na barra de busca superior, digite **RDS** e clique no serviço **RDS**.
2. **Criar Banco de Dados**:
   - Clique no botão laranja **Criar banco de dados** (*Create database*).
   - Método de criação: **Criação padrão** (*Standard create*).
   - Tipo de mecanismo: **PostgreSQL**.
   - Versão do mecanismo: Selecionar **PostgreSQL 16.x**.
   - Modelos (*Templates*): Selecionar **Nível gratuito** (*Free Tier*).
3. **Configurações de Identificação e Credenciais**:
   - **Identificador da instância de banco de dados**: `canto-alegre-db`.
   - **Nome do usuário principal**: `cantoalegre_admin`.
   - **Senha principal**: Digite uma senha forte (ex: `CantoAlegre#2026Prod`).
4. **Conectividade & Acesso**:
   - **Acesso público**: Selecionar **Sim** (*Yes*) para permitir conexões de teste vindas da sua máquina local ou de servidores externos.
   - **Grupo de segurança VPC (Security Group)**: Criar novo -> Nome: `canto-alegre-rds-sg`.
   - Garantir que a porta `5432` esteja aberta no Security Group para tráfego de entrada.
5. **Finalizar**:
   - Clique no botão **Criar banco de dados**. O RDS levará cerca de 3 a 5 minutos para provisionar a instância.
   - Após a conclusão, clique na instância `canto-alegre-db` e copie o **Ponto de extremidade** (*Endpoint*), ex: `canto-alegre-db.c123456789.sa-east-1.rds.amazonaws.com`.

---

### Passo 4: Conectar a API Spring Boot ao AWS S3 e AWS RDS

#### 1. Adicionar Dependência do AWS SDK S3 no `pom.xml` (Backend)

No arquivo `api/pom.xml`, adicione a dependência do AWS SDK v2 para Java:

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.25.15</version>
</dependency>
```

#### 2. Criar a Classe `S3StorageService.java` (Implementando `ImageStorageService`)

No pacote `com.cantoalegre.api.service`, crie a implementação para envio de imagens ao AWS S3:

```java
package com.cantoalegre.api.service;

import com.cantoalegre.api.exception.BusinessRuleException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@Profile("aws")
public class S3StorageService implements ImageStorageService {

    private final S3Client s3Client;
    private final String bucketName;
    private final String region;

    public S3StorageService(
            S3Client s3Client,
            @Value("${aws.s3.bucket-name}") String bucketName,
            @Value("${aws.s3.region:sa-east-1}") String region
    ) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
        this.region = region;
    }

    @Override
    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessRuleException("O arquivo de imagem enviado esta vazio");
        }

        String extension = getFileExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + extension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
        } catch (IOException e) {
            throw new BusinessRuleException("Falha ao enviar arquivo para o AWS S3: " + e.getMessage());
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return ".jpg";
    }
}
```

#### 3. Configurar o Profile de Produção (`application-prod.properties`)

No diretório `api/src/main/resources/`, crie o arquivo `application-prod.properties`:

```properties
# Configuracao do Banco de Dados PostgreSQL no AWS RDS
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:5432/${DB_NAME:cantoalegredb}
spring.datasource.username=${DB_USER:cantoalegre_admin}
spring.datasource.password=${DB_PASSWORD:sua_senha}
spring.datasource.driver-class-name=org.postgresql.Driver

# Execucao automatica das Migracoes Flyway (V1 e V2)
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true

# Configuracao do AWS S3
aws.accessKeyId=${AWS_ACCESS_KEY_ID}
aws.secretAccessKey=${AWS_SECRET_ACCESS_KEY}
aws.s3.region=${AWS_REGION:sa-east-1}
aws.s3.bucket-name=${AWS_S3_BUCKET:canto-alegre-fotos-prod}
```

---

### Passo 5: Fazer o Deploy da API REST e do PWA Frontend

#### Opção Recomendada 1: Deploy Simplificado e Gratuito/Econômico (Render + Vercel)
- **Backend (Spring Boot + PostgreSQL RDS/Render)**:
  - Crie uma conta em `https://render.com/`.
  - Conecte o repositório GitHub `naur-Io/Canto-Alegre`.
  - Suba o serviço Docker/Java a partir da pasta `/api` definindo as variáveis de ambiente (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
- **Frontend PWA (Vercel)**:
  - Crie uma conta em `https://vercel.com/`.
  - Importe o repositório GitHub.
  - Root Directory: `./` (raiz).
  - Build Command: `npm run build`.
  - Output Directory: `dist`.
  - Variável de ambiente: `VITE_API_URL=https://sua-api.onrender.com`.

#### Opção Recomendada 2: Deploy 100% AWS (AWS App Runner + AWS Amplify)
- **Backend**:
  - No Console AWS, acesse **AWS App Runner** -> **Create service**.
  - Selecione o repositório GitHub da API Spring Boot ou a imagem Docker.
  - Porta de execução: `8080`.
  - Defina as variáveis de ambiente de banco de dados e chaves IAM S3.
- **Frontend PWA**:
  - No Console AWS, acesse **AWS Amplify** -> **New app** -> **Host web app**.
  - Conecte a branch `main` do repositório `naur-Io/Canto-Alegre`.
  - O AWS Amplify detectará automaticamente o projeto Vite React e fará a compilação pública em HTTPS com suporte PWA.

---

## 3. Checklist de Validação da Fase 3

Antes de considerar a infraestrutura pronta, execute a seguinte verificação:

1. [ ] **Testes de Integração**: Executar `./mvnw test` na pasta `api/` (garantindo que todos os 20 testes continuem passando).
2. [ ] **Migrações de Banco de Dados**: Acessar o banco de dados via DBeaver / pgAdmin conectado ao AWS RDS e verificar se as tabelas `plants`, `botanical_species`, `users` e a coluna `ideal_environment` foram criadas pelo Flyway.
3. [ ] **Upload no S3**: Cadastrar uma nova planta enviando foto e verificar se o arquivo foi salvo no bucket AWS S3 `canto-alegre-fotos-prod`.
4. [ ] **Sincronização PWA Offline**: Testar a aplicação no celular desconectando a internet e re-conectando para validar a fila de sincronização `syncService.js`.
