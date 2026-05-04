package com.clinica.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long>,
        JpaSpecificationExecutor<Appointment> {

    @Query("""
            SELECT COUNT(a) > 0 FROM Appointment a
            WHERE a.professional.id = :professionalId
            AND a.dateTime = :dateTime
            AND a.status <> 'CANCELADO'
            """)
    boolean existsConflict(@Param("professionalId") Long professionalId,
                           @Param("dateTime") LocalDateTime dateTime);
}
