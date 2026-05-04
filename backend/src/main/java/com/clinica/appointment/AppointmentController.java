package com.clinica.appointment;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@Tag(name = "Agendamentos", description = "Gerenciamento de agendamentos de consultas")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @Operation(summary = "Criar um novo agendamento")
    public ResponseEntity<AppointmentDTO.Response> create(@Valid @RequestBody AppointmentDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.create(request));
    }

    @GetMapping
    @Operation(summary = "Listar agendamentos com filtros opcionais")
    public ResponseEntity<List<AppointmentDTO.Response>> findAll(
            @Parameter(description = "Filtrar por ID do paciente")
            @RequestParam(required = false) Long patientId,

            @Parameter(description = "Filtrar por ID do profissional")
            @RequestParam(required = false) Long professionalId,

            @Parameter(description = "Filtrar por status (AGENDADO, CANCELADO, CONCLUIDO)")
            @RequestParam(required = false) AppointmentStatus status
    ) {
        return ResponseEntity.ok(appointmentService.findAll(patientId, professionalId, status));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancelar um agendamento informando o motivo")
    public ResponseEntity<AppointmentDTO.Response> cancel(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentDTO.CancelRequest request
    ) {
        return ResponseEntity.ok(appointmentService.cancel(id, request));
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Concluir um agendamento")
    public ResponseEntity<AppointmentDTO.Response> complete(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.complete(id));
    }
}
