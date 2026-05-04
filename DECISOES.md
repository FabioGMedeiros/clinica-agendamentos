# DECISOES.md — Decisões Técnicas

## Principais decisões técnicas

### Estrutura por módulo (package by feature)
Optei por organizar o código por domínio (`patient`, `professional`, `appointment`) em vez de camadas (`controllers`, `services`, `repositories`). Essa abordagem facilita a navegação e o entendimento do código por quem o lê pela primeira vez, além de tornar cada módulo coeso e independente.

### DTOs separados das entidades
As entidades JPA nunca são expostas diretamente nas respostas da API. Isso evita que mudanças internas no modelo afetem o contrato externo e previne a serialização acidental de dados sensíveis ou relacionamentos lazy.

### Records do Java para DTOs
Usei `record` do Java 17 para os DTOs de request e response. São imutáveis por natureza, com menos boilerplate e semanticamente corretos para objetos de transferência de dados.

### Specification JPA para filtros dinâmicos
A listagem de agendamentos aceita filtros opcionais por paciente, profissional e status. Em vez de criar múltiplos métodos no repositório (um para cada combinação), usei `JpaSpecificationExecutor` com predicados compostos — uma solução limpa e extensível.

### Enums persistidos como STRING
Os enums (`AppointmentStatus`, `AppointmentType`) são armazenados como texto no banco. Isso garante legibilidade direta nas queries SQL e evita problemas com a ordenação dos valores em caso de refatoração.

### H2 isolado para testes
Os testes unitários de serviço usam Mockito puro, sem subir o contexto Spring. Existe também um `application-test.properties` com H2 para testes de integração futuros, isolando completamente a infraestrutura de testes do banco real.

### PATCH para cancelamento
Usei `PATCH /appointments/{id}/cancel` em vez de `PUT` ou `DELETE` porque o cancelamento é uma **mudança parcial de estado** — o registro é mantido e apenas o status e o motivo são alterados.

---

## O que foi priorizado

- Regras de negócio corretas e bem testadas
- Código limpo, legível e organizado
- Validações completas nas entradas
- Tratamento de erros padronizado
- Documentação via Swagger
- Docker Compose funcional para facilitar a execução
- Interface com Angular 17 para consumo da API (diferencial da especificação)

---

## O que foi além dos requisitos

- **Endpoint de conclusão de agendamento (`PATCH /appointments/{id}/complete`):** a especificação previa apenas o cancelamento como transição de estado. Adicionei a conclusão como uma segunda transição controlada, com validação de que apenas agendamentos com status `AGENDADO` podem ser concluídos, cobertura de testes unitários e botão dedicado na interface Angular (desabilitado automaticamente quando o status não permite a ação).

### Validação de horário para conclusão
Só é permitido concluir um agendamento após o horário marcado (`dateTime <= now`). Considerei adicionar uma tolerância fixa de N minutos, mas descartei por ser um valor arbitrário sem base no domínio. A regra `dateTime <= now` é semanticamente correta: uma consulta só pode ser registrada como concluída depois que ela deveria ter ocorrido.

---

## O que ficou de fora

- **Autenticação/autorização (JWT):** fora do escopo do teste, mas seria o próximo passo natural com Spring Security
- **Paginação na listagem:** os endpoints retornam todos os registros; em produção seria implementado com `Pageable`
- **Migrations com Flyway/Liquibase:** optei por `ddl-auto=update` para simplificar a execução, mas em produção usaria migrations versionadas
- **Testes de integração completos:** há testes unitários cobrindo todas as regras de negócio; testes E2E com `@SpringBootTest` ficaram de fora pelo prazo
- **Compatibilidade com Oracle:** o projeto usa PostgreSQL; a compatibilidade com Oracle
    seria viável trocando o driver e ajustando o dialeto do Hibernate, sem mudanças no código de negócio

---

## Uso de IA

Utilizei IA como apoio pontual durante o desenvolvimento, principalmente para:
- Validar decisões de design já esboçadas (como o uso de `Specification` para filtros dinâmicos)
- Tirar dúvidas rápidas de sintaxe e APIs do Spring
- Revisar trechos de código em busca de inconsistências

