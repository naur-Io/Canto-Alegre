# Guia Completo de Anotações Java (Decoradores Spring, JPA & Testes)

Este documento e um manual de estudos sobre todas as **anotações ("decoradores") Java** utilizadas na construcao do backend **Canto Alegre API**. 

Cada anotação esta detalhada com sua **finalidade**, **localizacao exata no codigo**, **dependencias Maven/pacotes** e **como ela interage com a aplicacao e o banco de dados PostgreSQL**.

---

## Sumario das Categorias

1. [Anotacoes de Configuração e Core Spring](#1-anotacoes-de-configuracao-e-core-spring)
2. [Anotacoes de REST Controllers & Web MVC](#2-anotacoes-de-rest-controllers--web-mvc)
3. [Anotacoes de Tratamento de Excecoes (RFC 7807)](#3-anotacoes-de-tratamento-de-excecoes-rfc-7807)
4. [Anotacoes de Mapeamento Objeto-Relacional (JPA & Hibernate)](#4-anotacoes-de-mapeamento-objeto-relacional-jpa--hibernate)
5. [Anotacoes de Repositorios Spring Data JPA](#5-anotacoes-de-repositorios-spring-data-jpa)
6. [Anotacoes de Transacoes ACID](#6-anotacoes-de-transacoes-acid)
7. [Anotacoes de Seguranca (Spring Security)](#7-anotacoes-de-seguranca-spring-security)
8. [Anotacoes de Validacao (Jakarta Bean Validation)](#8-anotacoes-de-validacao-jakarta-bean-validation)
9. [Anotacoes Lombok (Produtividade e Boilerplate)](#9-anotacoes-lombok-produtividade-e-boilerplate)
10. [Anotacoes de Testes Unitarios e Integracao (JUnit 5, Mockito & Testcontainers)](#10-anotacoes-de-testes-unitarios-e-integracao-junit-5-mockito--testcontainers)

---

## 1. Anotacoes de Configuração e Core Spring

### `@SpringBootApplication`
- **Para que serve**: Marca a classe principal da aplicacao Spring Boot. Combina três anotações essenciais: `@Configuration` (permite registrar Beans), `@EnableAutoConfiguration` (habilita configuracoes automaticas do Spring Boot com base nas dependencias do `pom.xml`) e `@ComponentScan` (procura componentes no pacote base `com.cantoalegre.api`).
- **Onde esta no projeto**: [ApiApplication.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/ApiApplication.java#L7)
- **Dependencia / Pacote**: `org.springframework.boot.autoconfigure.SpringBootApplication` (Módulo: `spring-boot-autoconfigure`)
- **Comunicacao Software / Banco**: Inicializa o container IoC (Inversao de Controle) do Spring, dispara o Flyway para migracao do PostgreSQL e sobe o servidor Web embutido (Tomcat na porta 8080).

### `@Configuration`
- **Para que serve**: Indica que a classe e uma fonte de definicao de Beans gerenciados pelo Spring.
- **Onde esta no projeto**:
  - [SecurityConfig.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/config/SecurityConfig.java#L11)
  - [JacksonConfig.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/config/JacksonConfig.java#L8)
- **Dependencia / Pacote**: `org.springframework.context.annotation.Configuration` (Módulo: `spring-context`)
- **Comunicacao Software / Banco**: O Spring varre estas classes durante o boot para instanciar e injetar componentes globais no contexto do sistema.

### `@Bean`
- **Para que serve**: Indica que o metodo instanciará, configurará e retornará um objeto que deve ser gerenciado pelo container do Spring como um Bean singleton.
- **Onde esta no projeto**:
  - [SecurityConfig.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/config/SecurityConfig.java#L15) (Configura a `SecurityFilterChain`)
  - [JacksonConfig.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/config/JacksonConfig.java#L11) (Configura o `ObjectMapper` com `JavaTimeModule`)
- **Dependencia / Pacote**: `org.springframework.context.annotation.Bean` (Módulo: `spring-context`)
- **Comunicacao Software / Banco**: Permite que outras classes (como `GeminiService` ou os Controllers) recebam a instancia pronta via injecao de dependencia.

### `@Value`
- **Para que serve**: Injeta valores de propriedades configuradas no `application.yml` ou em variaveis de ambiente do sistema operacional.
- **Onde esta no projeto**: [GeminiService.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/service/GeminiService.java#L19) (`@Value("${gemini.api-key:}")`)
- **Dependencia / Pacote**: `org.springframework.beans.factory.annotation.Value` (Módulo: `spring-beans`)
- **Comunicacao Software / Banco**: Le a chave da API do Gemini (`GEMINI_API_KEY`) para autenticar requisicoes HTTP com o Google AI Studio.

---

## 2. Anotacoes de REST Controllers & Web MVC

### `@RestController`
- **Para que serve**: Declara que a classe e um controlador REST. Combina `@Controller` e `@ResponseBody`, convertendo automaticamente os retornos dos metodos para JSON.
- **Onde esta no projeto**:
  - [PlantController.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/controller/PlantController.java#L12)
  - [BotanicalSpeciesController.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/controller/BotanicalSpeciesController.java#L12)
- **Dependencia / Pacote**: `org.springframework.web.bind.annotation.RestController` (Módulo: `spring-web`)
- **Comunicacao Software / Banco**: Recebe chamadas HTTP do cliente PWA/cURL e delega a execucao para a camada de Service, serializando as respostas em JSON via Jackson.

### `@RequestMapping`
- **Para que serve**: Mapeia a URL base ou caminhos especificos para um controlador ou metodo REST.
- **Onde esta no projeto**:
  - [PlantController.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/controller/PlantController.java#L13) (`/api/v1/plants`)
  - [BotanicalSpeciesController.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/controller/BotanicalSpeciesController.java#L13) (`{"/api/v1/species", "/api/v1/botanical-species"}`)
- **Dependencia / Pacote**: `org.springframework.web.bind.annotation.RequestMapping` (Módulo: `spring-web`)

### `@GetMapping` e `@PostMapping`
- **Para que serve**: Mapeiam requisições HTTP GET (leitura) e POST (escrita/criacao) para metodos especificos.
- **Onde esta no projeto**: Metodos em `PlantController.java` e `BotanicalSpeciesController.java`.
- **Dependencia / Pacote**: `org.springframework.web.bind.annotation.GetMapping`, `PostMapping` (Módulo: `spring-web`)

### `@RequestHeader`
- **Para que serve**: Extrai o valor de um cabeçalho HTTP especifico enviado pelo cliente.
- **Onde esta no projeto**: `PlantController.java` (`@RequestHeader("X-Guest-Id") UUID guestUuid`)
- **Dependencia / Pacote**: `org.springframework.web.bind.annotation.RequestHeader` (Módulo: `spring-web`)
- **Comunicacao Software / Banco**: Fornece o `guest_uuid` enviado pelo PWA para isolar estritamente as consultas SQL do usuario no PostgreSQL.

### `@PathVariable` e `@RequestParam`
- **Para que serve**: Extraem parametros dinâmicos da URL. `@PathVariable` pega variaveis da URI (ex: `/plants/{id}`) e `@RequestParam` pega query strings (ex: `/species?search=Jiboia`).
- **Onde esta no projeto**: `PlantController.java` (`@PathVariable UUID id`) e `BotanicalSpeciesController.java` (`@RequestParam String name`).
- **Dependencia / Pacote**: `org.springframework.web.bind.annotation.PathVariable`, `RequestParam` (Módulo: `spring-web`)

### `@RequestBody`
- **Para que serve**: Deserializa o corpo JSON da requisicao HTTP para um objeto Java (DTO).
- **Onde esta no projeto**: `PlantController.java` (`@RequestBody CreatePlantRequest request`).
- **Dependencia / Pacote**: `org.springframework.web.bind.annotation.RequestBody` (Módulo: `spring-web`)

### `@ResponseStatus`
- **Para que serve**: Define o codigo de status HTTP padrao retornado quando o metodo e executado com sucesso (ex: `HttpStatus.CREATED` -> 201).
- **Onde esta no projeto**: Metodos de criacao em `PlantController.java` e `BotanicalSpeciesController.java`.
- **Dependencia / Pacote**: `org.springframework.web.bind.annotation.ResponseStatus` (Módulo: `spring-web`)

---

## 3. Anotacoes de Tratamento de Excecoes (RFC 7807)

### `@RestControllerAdvice`
- **Para que serve**: Declara um interceptador de exceções global para todos os `@RestController`. Permite centralizar o tratamento de erros e formatar a resposta no padrao RFC 7807 (`ProblemDetail`).
- **Onde esta no projeto**: [GlobalExceptionHandler.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/exception/GlobalExceptionHandler.java#L14)
- **Dependencia / Pacote**: `org.springframework.web.bind.annotation.RestControllerAdvice` (Módulo: `spring-web`)

### `@ExceptionHandler`
- **Para que serve**: Mapeia uma classe de excecao especifica (ex: `ResourceNotFoundException.class`, `MethodArgumentNotValidException.class`) para um metodo tratador.
- **Onde esta no projeto**: Metodos em `GlobalExceptionHandler.java`.
- **Dependencia / Pacote**: `org.springframework.web.bind.annotation.ExceptionHandler` (Módulo: `spring-web`)
- **Comunicacao Software / Banco**: Converte excecoes lancadas pela camada de servico ou banco de dados em respostas HTTP estruturadas com codigo de status (400, 404, 500).

---

## 4. Anotacoes de Mapeamento Objeto-Relacional (JPA & Hibernate)

### `@Entity` e `@Table`
- **Para que serve**: `@Entity` marca a classe Java como uma entidade JPA gerenciada pelo Hibernate. `@Table` define o nome exato da tabela no banco de dados.
- **Onde esta no projeto**:
  - [User.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/domain/model/User.java#L11) (`@Table(name = "users")`)
  - [Plant.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/domain/model/Plant.java#L13) (`@Table(name = "plants")`)
  - [BotanicalSpecies.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/domain/model/BotanicalSpecies.java#L11) (`@Table(name = "botanical_species")`)
  - [WateringLog.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/domain/model/WateringLog.java#L10) (`@Table(name = "watering_logs")`)
- **Dependencia / Pacote**: `jakarta.persistence.Entity`, `Table` (Módulo: `jakarta.persistence-api`)
- **Comunicacao Software / Banco**: Mapeia objetos Java em memoria para linhas em tabelas SQL no PostgreSQL.

### `@Id` e `@GeneratedValue`
- **Para que serve**: `@Id` indica a chave primaria da tabela. `@GeneratedValue(strategy = GenerationType.UUID)` instrui o Hibernate/JPA a gerar um identificador unico UUID v4 automaticamente.
- **Onde esta no projeto**: Em todas as entidades em `domain/model/`.
- **Dependencia / Pacote**: `jakarta.persistence.Id`, `GeneratedValue`, `GenerationType` (Módulo: `jakarta.persistence-api`)

### `@Column`
- **Para que serve**: Configura detalhes da coluna SQL associada ao atributo (nome da coluna, se aceita nulo, tamanho maximo, restricoes de unicidade).
- **Onde esta no projeto**: Atributos das entidades em `domain/model/`.
- **Dependencia / Pacote**: `jakarta.persistence.Column` (Módulo: `jakarta.persistence-api`)

### `@ManyToOne`, `@OneToMany` e `@JoinColumn`
- **Para que serve**:
  - `@ManyToOne`: Define relacionamento N:1 (ex: Muitas plantas pertencem a Um Usuario ou a Uma Especie).
  - `@JoinColumn`: Especifica a chave estrangeira (FK) na tabela (ex: `user_id`, `species_id`).
  - `@OneToMany`: Define relacionamento 1:N (ex: Uma Planta possui Muitos logs de rega `watering_logs`).
- **Onde esta no projeto**: [Plant.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/domain/model/Plant.java#L27-L55)
- **Dependencia / Pacote**: `jakarta.persistence.ManyToOne`, `OneToMany`, `JoinColumn` (Módulo: `jakarta.persistence-api`)
- **Comunicacao Software / Banco**: Traduz relacoes entre tabelas relacionais do PostgreSQL para coleções e referencias entre objetos em Java.

### `@Enumerated(EnumType.STRING)`
- **Para que serve**: Mapeia um Enum Java para ser salvo no banco como texto String (ex: `"FULL_SUN"`, `"PARTIAL_SHADE"`) em vez de ordinal numerico (0, 1).
- **Onde esta no projeto**: [BotanicalSpecies.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/domain/model/BotanicalSpecies.java#L37)
- **Dependencia / Pacote**: `jakarta.persistence.Enumerated`, `EnumType` (Módulo: `jakarta.persistence-api`)

### `@CreationTimestamp` e `@UpdateTimestamp`
- **Para que serve**: Anotações especificas do Hibernate que preenchem automaticamente a data/hora de criacao (`created_at`) e ultima atualizacao (`updated_at`).
- **Onde esta no projeto**: Em todas as entidades em `domain/model/`.
- **Dependencia / Pacote**: `org.hibernate.annotations.CreationTimestamp`, `UpdateTimestamp` (Módulo: `hibernate-core`)

---

## 5. Anotacoes de Repositorios Spring Data JPA

### `@Repository`
- **Para que serve**: Marca a interface como um componente de acesso a dados (DAO/Repository) do Spring, habilitando a traducao automatica de exceções de banco de dados.
- **Onde esta no projeto**: `UserRepository.java`, `PlantRepository.java`, `BotanicalSpeciesRepository.java`.
- **Dependencia / Pacote**: `org.springframework.stereotype.Repository` (Módulo: `spring-repository`)

### `@Query` e `@Param`
- **Para que serve**: Permite escrever consultas customizadas em JPQL (Java Persistence Query Language). Nossos repositorios utilizam `JOIN FETCH` nas queries JPQL para carregar entidades relacionadas em uma unica consulta SQL, **zerando o problema de performance N+1**.
- **Onde esta no projeto**: [PlantRepository.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/repository/PlantRepository.java#L18)
- **Dependencia / Pacote**: `org.springframework.data.jpa.repository.Query`, `org.springframework.data.repository.query.Param` (Módulo: `spring-data-jpa`)
- **Comunicacao Software / Banco**: Executa a query JPQL otimizada no PostgreSQL:
  ```sql
  SELECT p.*, s.* FROM plants p LEFT JOIN botanical_species s ON p.species_id = s.id WHERE p.user_id = ?
  ```

---

## 6. Anotacoes de Transacoes ACID

### `@Transactional`
- **Para que serve**: Garante que o metodo seja executado dentro de uma transacao de banco de dados ACID (Atomica, Consistente, Isolada e Duravel). Se qualquer excecao ocorrer, o Spring faz **rollback** automatico de todas as alteracoes. Quando configurado como `@Transactional(readOnly = true)`, otimiza o desempenho ignorando o checagem de alteracoes (dirty-checking) do Hibernate.
- **Onde esta no projeto**: Em todos os metodos das classes em `service/` (`PlantService`, `UserService`, `BotanicalSpeciesService`).
- **Dependencia / Pacote**: `org.springframework.transaction.annotation.Transactional` (Módulo: `spring-tx`)
- **Comunicacao Software / Banco**: Controla os comandos SQL `BEGIN`, `COMMIT` e `ROLLBACK` enviados ao PostgreSQL.

---

## 7. Anotacoes de Seguranca (Spring Security)

### `@EnableWebSecurity`
- **Para que serve**: Habilita a integracao de seguranca web do Spring Security na aplicacao.
- **Onde esta no projeto**: [SecurityConfig.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/main/java/com/cantoalegre/api/config/SecurityConfig.java#L12)
- **Dependencia / Pacote**: `org.springframework.security.config.annotation.web.configuration.EnableWebSecurity` (Módulo: `spring-security-config`)

---

## 8. Anotacoes de Validacao (Jakarta Bean Validation)

### `@Valid`, `@NotBlank`, `@NotNull`, `@Size`, `@Min`
- **Para que serve**:
  - `@Valid`: Aciona a validacao declarativa no corpo da requisicao do Controller.
  - `@NotBlank`: Garante que a String nao e nula e nao esta em branco.
  - `@NotNull`: Garante que o atributo nao e nulo.
  - `@Size(max = 100)`: Define tamanho maximo de caracteres.
  - `@Min(value = 1)`: Define valor numerico minimo.
- **Onde esta no projeto**: DTOs em `dto/request/` (`CreatePlantRequest`, `CreateBotanicalSpeciesRequest`, etc.) e Controllers em `controller/`.
- **Dependencia / Pacote**: `jakarta.validation.Valid`, `constraints.*` (Módulo: `jakarta.validation-api`)
- **Comunicacao Software / Banco**: Bloqueia requisicoes invalidas antes mesmo que alcancem o banco de dados, disparando `MethodArgumentNotValidException` capturada pelo `GlobalExceptionHandler`.

---

## 9. Anotacoes Lombok (Produtividade e Boilerplate)

- **`@Getter` / `@Setter`**: Gera automaticamente os metodos get e set para todos os atributos.
- **`@NoArgsConstructor` / `@AllArgsConstructor`**: Gera construtores sem argumentos e com todos os argumentos.
- **`@Builder`**: Implementa o padrao de projeto Builder para criacao fluida de objetos (ex: `Plant.builder().nickname("Jiboia").build()`).
- **`@EqualsAndHashCode(of = "id")`**: Gera metodos equals e hashCode baseados estritamente na chave primaria ID.
- **`@RequiredArgsConstructor`**: Gera construtor automaticamente para atributos `final`, realizando **injecao de dependencia por construtor** sem necessidade de `@Autowired`.
- **`@Slf4j`**: Injeta um logger SLF4J (`log.info()`, `log.error()`) na classe.
- **Onde estao no projeto**: Entidades em `domain/model/`, servicos em `service/`, controllers em `controller/`.
- **Dependencia / Pacote**: `lombok.*` (Módulo: `lombok`)

---

## 10. Anotacoes de Testes Unitarios e Integracao (JUnit 5, Mockito & Testcontainers)

### `@Test`, `@BeforeEach` e `@DisplayName`
- **Para que serve**: `@Test` marca o metodo de teste. `@BeforeEach` roda codigo de preparacao antes de cada teste. `@DisplayName` adiciona uma descricao legivel ao teste no relatorio.
- **Onde esta no projeto**: Todas as classes de teste em `src/test/java/`.
- **Dependencia / Pacote**: `org.junit.jupiter.api.*` (Módulo: `junit-jupiter-api`)

### `@ExtendWith(MockitoExtension.class)`, `@Mock` e `@InjectMocks`
- **Para que serve**: Habilita a criacao de objetos simulados (Mocks) para isolar testes unitarios de servico sem acessar banco de dados real.
- **Onde esta no projeto**: `PlantServiceTest`, `BotanicalSpeciesServiceTest`, `UserServiceTest`.
- **Dependencia / Pacote**: `org.mockito.junit.jupiter.MockitoExtension`, `org.mockito.Mock`, `InjectMocks` (Módulo: `mockito-junit-jupiter`)

### `@SpringBootTest`, `@AutoConfigureMockMvc`, `@Testcontainers`, `@Container` e `@ServiceConnection`
- **Para que serve**:
  - `@SpringBootTest`: Carrega o contexto Spring completo para teste de integracao.
  - `@AutoConfigureMockMvc`: Injeta o `MockMvc` para simular requisicoes HTTP REST.
  - `@Testcontainers`: Habilita a gestao de containers Docker durante o teste.
  - `@Container`: Declara o container PostgreSQL `postgres:16-alpine`.
  - `@ServiceConnection`: Conecta automaticamente a URL/usuario/senha do container PostgreSQL dinamico ao Spring Boot.
- **Onde esta no projeto**: [AbstractIntegrationTest.java](file:///Users/ruanrickelmelucenaramos/Documents/Programming/Canto-Alegre/api/src/test/java/com/cantoalegre/api/integration/AbstractIntegrationTest.java#L10-L15)
- **Dependencia / Pacote**: `org.springframework.boot.testcontainers.service.connection.ServiceConnection`, `org.testcontainers.junit.jupiter.*` (Módulo: `spring-boot-testcontainers`, `testcontainers`)
