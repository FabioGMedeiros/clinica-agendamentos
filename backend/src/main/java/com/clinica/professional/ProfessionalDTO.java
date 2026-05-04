package com.clinica.professional;

import jakarta.validation.constraints.NotBlank;

public class ProfessionalDTO {

    public record Request(
            @NotBlank(message = "Nome é obrigatório")
            String name,

            @NotBlank(message = "Especialidade é obrigatória")
            String specialty,

            @NotBlank(message = "CRM é obrigatório")
            String crm
    ) {}

    public record Response(
            Long id,
            String name,
            String specialty,
            String crm
    ) {
        public static Response from(Professional professional) {
            return new Response(
                    professional.getId(),
                    professional.getName(),
                    professional.getSpecialty(),
                    professional.getCrm()
            );
        }
    }
}
