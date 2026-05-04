package com.clinica.patient;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@Tag(name = "Pacientes", description = "Gerenciamento de pacientes")
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    @Operation(summary = "Cadastrar um novo paciente")
    public ResponseEntity<PatientDTO.Response> create(@Valid @RequestBody PatientDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.create(request));
    }

    @GetMapping
    @Operation(summary = "Listar todos os pacientes")
    public ResponseEntity<List<PatientDTO.Response>> findAll() {
        return ResponseEntity.ok(patientService.findAll());
    }
}
