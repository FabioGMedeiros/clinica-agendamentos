package com.clinica.professional;

import com.clinica.exception.BusinessException;
import com.clinica.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessionalService {

    private final ProfessionalRepository professionalRepository;

    @Transactional
    public ProfessionalDTO.Response create(ProfessionalDTO.Request request) {
        if (professionalRepository.existsByCrm(request.crm())) {
            throw new BusinessException("Já existe um profissional cadastrado com o CRM informado.");
        }

        Professional professional = Professional.builder()
                .name(request.name())
                .specialty(request.specialty())
                .crm(request.crm())
                .build();

        return ProfessionalDTO.Response.from(professionalRepository.save(professional));
    }

    @Transactional(readOnly = true)
    public List<ProfessionalDTO.Response> findAll() {
        return professionalRepository.findAll()
                .stream()
                .map(ProfessionalDTO.Response::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Professional findEntityById(Long id) {
        return professionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado com id: " + id));
    }
}
