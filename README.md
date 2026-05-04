# Clínica Agendamentos

API REST para controle de agendamentos de consultas médicas, desenvolvida com Java 17 + Spring Boot 3 e frontend Angular 17.

---

## Como executar

### Opção 1 — Docker Compose (recomendado)

> Pré-requisitos: Docker e Docker Compose instalados.

```bash
# Na raiz do projeto
docker-compose up --build
```

A API ficará disponível em: `http://localhost:8080`  
O Swagger UI em: `http://localhost:8080/swagger-ui.html`

---

### Opção 2 — Executar manualmente

#### Backend

> Pré-requisitos: Java 17+, Maven 3.8+, PostgreSQL rodando.

1. Crie o banco de dados:
```sql
CREATE DATABASE clinica_db;
CREATE USER clinica_user WITH PASSWORD 'clinica_pass';
GRANT ALL PRIVILEGES ON DATABASE clinica_db TO clinica_user;
```

2. Execute:
```bash
cd backend
mvn spring-boot:run
```

#### Frontend

> Pré-requisitos: Node 18+, Angular CLI 17+

```bash
cd frontend
npm install
ng serve
```

Frontend disponível em: `http://localhost:4200`

---

## Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/patients` | Cadastrar paciente |
| `GET` | `/patients` | Listar pacientes |
| `POST` | `/professionals` | Cadastrar profissional |
| `GET` | `/professionals` | Listar profissionais |
| `POST` | `/appointments` | Criar agendamento |
| `GET` | `/appointments` | Listar agendamentos (aceita `?patientId=`, `?professionalId=`, `?status=`) |
| `PATCH` | `/appointments/{id}/cancel` | Cancelar agendamento |

Documentação interativa completa: `http://localhost:8080/swagger-ui.html`

---

## Testes

```bash
cd backend
mvn test
```

---

## Compatibilidade com Oracle

A aplicação usa JPA/Hibernate, portanto a migração para Oracle requer apenas:

1. Substituir a dependência `postgresql` por `ojdbc11` no `pom.xml`
2. Alterar o `spring.jpa.database-platform` para `org.hibernate.dialect.OracleDialect`
3. Atualizar a URL de conexão no `application.properties`

Nenhuma alteração no código de negócio é necessária.
