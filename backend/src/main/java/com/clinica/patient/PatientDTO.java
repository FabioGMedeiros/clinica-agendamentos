package com.clinica.patient;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PatientDTO {

    public record Request(
            @NotBlank(message = "Nome é obrigatório")
            String name,

            @NotBlank(message = "CPF é obrigatório")
            @Size(min = 11, max = 11, message = "CPF deve ter 11 dígitos")
            String cpf,

            @NotBlank(message = "Telefone é obrigatório")
            String phone,

            @NotBlank(message = "E-mail é obrigatório")
            @Email(message = "E-mail inválido")
            String email
    ) {}

    public record Response(
            Long id,
            String name,
            String cpf,
            String phone,
            String email
    ) {
        public static Response from(Patient patient) {
            return new Response(
                    patient.getId(),
                    patient.getName(),
                    patient.getCpf(),
                    patient.getPhone(),
                    patient.getEmail()
            );
        }
    }
}
