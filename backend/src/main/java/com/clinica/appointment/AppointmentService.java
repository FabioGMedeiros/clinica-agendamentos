package com.clinica.appointment;

import com.clinica.exception.BusinessException;
import com.clinica.exception.ResourceNotFoundException;
import com.clinica.patient.Patient;
import com.clinica.patient.PatientService;
import com.clinica.professional.Professional;
import com.clinica.professional.ProfessionalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientService patientService;
    private final ProfessionalService professionalService;

    @Transactional
    public AppointmentDTO.Response create(AppointmentDTO.Request request) {
        // Regra: data/hora não pode ser no passado
        if (!request.dateTime().isAfter(LocalDateTime.now())) {
            throw new BusinessException("A data e hora do agendamento devem ser no futuro.");
        }

        Patient patient = patientService.findEntityById(request.patientId());
        Professional professional = professionalService.findEntityById(request.professionalId());

        // Regra: profissional não pode ter dois agendamentos no mesmo horário
        if (appointmentRepository.existsConflict(professional.getId(), request.dateTime())) {
            throw new BusinessException("O profissional já possui um agendamento neste horário.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .professional(professional)
                .dateTime(request.dateTime())
                .type(request.type())
                .status(AppointmentStatus.AGENDADO)
                .build();

        return AppointmentDTO.Response.from(appointmentRepository.save(appointment));
    }

    @Transactional(readOnly = true)
    public List<AppointmentDTO.Response> findAll(Long patientId, Long professionalId, AppointmentStatus status) {
        Specification<Appointment> spec = Specification
                .where(AppointmentSpecification.byPatientId(patientId))
                .and(AppointmentSpecification.byProfessionalId(professionalId))
                .and(AppointmentSpecification.byStatus(status));

        return appointmentRepository.findAll(spec)
                .stream()
                .map(AppointmentDTO.Response::from)
                .toList();
    }

    @Transactional
    public AppointmentDTO.Response cancel(Long id, AppointmentDTO.CancelRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado com id: " + id));

        if (appointment.getStatus() == AppointmentStatus.CANCELADO) {
            throw new BusinessException("O agendamento já está cancelado.");
        }

        appointment.setStatus(AppointmentStatus.CANCELADO);
        appointment.setCancelReason(request.reason());

        return AppointmentDTO.Response.from(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentDTO.Response complete(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado com id: " + id));

        if (appointment.getStatus() != AppointmentStatus.AGENDADO) {
            throw new BusinessException("Apenas agendamentos com status AGENDADO podem ser concluídos.");
        }

        if (appointment.getDateTime().isAfter(LocalDateTime.now())) {
            throw new BusinessException("O agendamento só pode ser concluído após o horário marcado.");
        }

        appointment.setStatus(AppointmentStatus.CONCLUIDO);

        return AppointmentDTO.Response.from(appointmentRepository.save(appointment));
    }
}
