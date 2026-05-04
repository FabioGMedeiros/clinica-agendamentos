package com.clinica.appointment;

import com.clinica.patient.PatientDTO;
import com.clinica.professional.ProfessionalDTO;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class AppointmentDTO {

    public record Request(
            @NotNull(message = "Paciente é obrigatório")
            Long patientId,

            @NotNull(message = "Profissional é obrigatório")
            Long professionalId,

            @NotNull(message = "Data e hora são obrigatórios")
            @Future(message = "Data e hora devem ser no futuro")
            LocalDateTime dateTime,

            @NotNull(message = "Tipo de atendimento é obrigatório")
            AppointmentType type
    ) {}

    public record CancelRequest(
            @NotBlank(message = "Motivo do cancelamento é obrigatório")
            String reason
    ) {}

    public record Response(
            Long id,
            PatientDTO.Response patient,
            ProfessionalDTO.Response professional,
            LocalDateTime dateTime,
            AppointmentType type,
            AppointmentStatus status,
            String cancelReason
    ) {
        public static Response from(Appointment appointment) {
            return new Response(
                    appointment.getId(),
                    PatientDTO.Response.from(appointment.getPatient()),
                    ProfessionalDTO.Response.from(appointment.getProfessional()),
                    appointment.getDateTime(),
                    appointment.getType(),
                    appointment.getStatus(),
                    appointment.getCancelReason()
            );
        }
    }
}
