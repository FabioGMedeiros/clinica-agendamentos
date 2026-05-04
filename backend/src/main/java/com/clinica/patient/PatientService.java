package com.clinica.patient;

import com.clinica.exception.BusinessException;
import com.clinica.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    @Transactional
    public PatientDTO.Response create(PatientDTO.Request request) {
        if (patientRepository.existsByCpf(request.cpf())) {
            throw new BusinessException("Já existe um paciente cadastrado com o CPF informado.");
        }

        Patient patient = Patient.builder()
                .name(request.name())
                .cpf(request.cpf())
                .phone(request.phone())
                .email(request.email())
                .build();

        return PatientDTO.Response.from(patientRepository.save(patient));
    }

    @Transactional(readOnly = true)
    public List<PatientDTO.Response> findAll() {
        return patientRepository.findAll()
                .stream()
                .map(PatientDTO.Response::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Patient findEntityById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com id: " + id));
    }
}
