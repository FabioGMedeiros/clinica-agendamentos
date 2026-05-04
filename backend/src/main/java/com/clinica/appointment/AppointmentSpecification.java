package com.clinica.appointment;

import org.springframework.data.jpa.domain.Specification;

public class AppointmentSpecification {

    private AppointmentSpecification() {}

    public static Specification<Appointment> byPatientId(Long patientId) {
        return (root, query, cb) ->
                patientId == null ? null : cb.equal(root.get("patient").get("id"), patientId);
    }

    public static Specification<Appointment> byProfessionalId(Long professionalId) {
        return (root, query, cb) ->
                professionalId == null ? null : cb.equal(root.get("professional").get("id"), professionalId);
    }

    public static Specification<Appointment> byStatus(AppointmentStatus status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }
}
