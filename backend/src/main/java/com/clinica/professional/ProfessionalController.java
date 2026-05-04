package com.clinica.professional;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professionals")
@RequiredArgsConstructor
@Tag(name = "Profissionais", description = "Gerenciamento de profissionais")
public class ProfessionalController {

    private final ProfessionalService professionalService;

    @PostMapping
    @Operation(summary = "Cadastrar um novo profissional")
    public ResponseEntity<ProfessionalDTO.Response> create(@Valid @RequestBody ProfessionalDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(professionalService.create(request));
    }

    @GetMapping
    @Operation(summary = "Listar todos os profissionais")
    public ResponseEntity<List<ProfessionalDTO.Response>> findAll() {
        return ResponseEntity.ok(professionalService.findAll());
    }
}
