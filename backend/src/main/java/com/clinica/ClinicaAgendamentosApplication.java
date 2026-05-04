package com.clinica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class ClinicaAgendamentosApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClinicaAgendamentosApplication.class, args);
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
	}

}
