package com.clinica.appointment;

import com.clinica.exception.BusinessException;
import com.clinica.patient.Patient;
import com.clinica.patient.PatientService;
import com.clinica.professional.Professional;
import com.clinica.professional.ProfessionalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AppointmentService - Regras de negócio")
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PatientService patientService;

    @Mock
    private ProfessionalService professionalService;

    @InjectMocks
    private AppointmentService appointmentService;

    private Patient patient;
    private Professional professional;

    @BeforeEach
    void setUp() {
        patient = Patient.builder()
                .id(1L).name("João Silva").cpf("12345678901")
                .phone("11999999999").email("joao@email.com")
                .build();

        professional = Professional.builder()
                .id(1L).name("Dr. Ana").specialty("Cardiologia").crm("CRM12345")
                .build();
    }

    @Test
    @DisplayName("Deve lançar exceção quando data é no passado")
    void shouldThrowWhenDateIsInThePast() {
        LocalDateTime pastDate = LocalDateTime.now().minusDays(1);

        AppointmentDTO.Request request = new AppointmentDTO.Request(
                1L, 1L, pastDate, AppointmentType.CONSULTA
        );

        assertThatThrownBy(() -> appointmentService.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("futuro");
    }

    @Test
    @DisplayName("Deve lançar exceção quando profissional tem conflito de horário")
    void shouldThrowWhenProfessionalHasScheduleConflict() {
        LocalDateTime futureDate = LocalDateTime.now().plusDays(1);

        AppointmentDTO.Request request = new AppointmentDTO.Request(
                1L, 1L, futureDate, AppointmentType.CONSULTA
        );

        when(patientService.findEntityById(1L)).thenReturn(patient);
        when(professionalService.findEntityById(1L)).thenReturn(professional);
        when(appointmentRepository.existsConflict(1L, futureDate)).thenReturn(true);

        assertThatThrownBy(() -> appointmentService.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("horário");
    }

    @Test
    @DisplayName("Deve criar agendamento com sucesso")
    void shouldCreateAppointmentSuccessfully() {
        LocalDateTime futureDate = LocalDateTime.now().plusDays(1);

        AppointmentDTO.Request request = new AppointmentDTO.Request(
                1L, 1L, futureDate, AppointmentType.CONSULTA
        );

        Appointment savedAppointment = Appointment.builder()
                .id(1L).patient(patient).professional(professional)
                .dateTime(futureDate).type(AppointmentType.CONSULTA)
                .status(AppointmentStatus.AGENDADO)
                .build();

        when(patientService.findEntityById(1L)).thenReturn(patient);
        when(professionalService.findEntityById(1L)).thenReturn(professional);
        when(appointmentRepository.existsConflict(1L, futureDate)).thenReturn(false);
        when(appointmentRepository.save(any())).thenReturn(savedAppointment);

        AppointmentDTO.Response response = appointmentService.create(request);

        assertThat(response).isNotNull();
        assertThat(response.status()).isEqualTo(AppointmentStatus.AGENDADO);
        assertThat(response.patient().id()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Deve cancelar agendamento e registrar motivo")
    void shouldCancelAppointmentWithReason() {
        Appointment appointment = Appointment.builder()
                .id(1L).patient(patient).professional(professional)
                .dateTime(LocalDateTime.now().plusDays(1))
                .type(AppointmentType.CONSULTA)
                .status(AppointmentStatus.AGENDADO)
                .build();

        when(appointmentRepository.findById(1L)).thenReturn(java.util.Optional.of(appointment));
        when(appointmentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        AppointmentDTO.CancelRequest cancelRequest = new AppointmentDTO.CancelRequest("Paciente não pode comparecer");
        AppointmentDTO.Response response = appointmentService.cancel(1L, cancelRequest);

        assertThat(response.status()).isEqualTo(AppointmentStatus.CANCELADO);
        assertThat(response.cancelReason()).isEqualTo("Paciente não pode comparecer");
    }

    @Test
    @DisplayName("Deve lançar exceção ao cancelar agendamento já cancelado")
    void shouldThrowWhenCancellingAlreadyCancelledAppointment() {
        Appointment appointment = Appointment.builder()
                .id(1L).patient(patient).professional(professional)
                .dateTime(LocalDateTime.now().plusDays(1))
                .type(AppointmentType.CONSULTA)
                .status(AppointmentStatus.CANCELADO)
                .build();

        when(appointmentRepository.findById(1L)).thenReturn(java.util.Optional.of(appointment));

        AppointmentDTO.CancelRequest cancelRequest = new AppointmentDTO.CancelRequest("Motivo qualquer");

        assertThatThrownBy(() -> appointmentService.cancel(1L, cancelRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("já está cancelado");
    }
}
