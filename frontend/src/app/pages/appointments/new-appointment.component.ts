import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentService } from '../../core/services/appointment.service';
import { PatientService } from '../../core/services/patient.service';
import { ProfessionalService } from '../../core/services/professional.service';
import { AppointmentType, CreateAppointmentRequest, Patient, Professional } from '../../core/models/models';

@Component({
  selector: 'app-new-appointment',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
      <a mat-icon-button routerLink="/appointments">
        <mat-icon>arrow_back</mat-icon>
      </a>
      <h2 style="margin: 0;">Novo Agendamento</h2>
    </div>

    <mat-card style="max-width: 600px;">
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()" style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px;">

          <mat-form-field appearance="outline">
            <mat-label>Paciente</mat-label>
            <mat-select formControlName="patientId">
              <mat-option *ngFor="let p of patients" [value]="p.id">{{ p.name }} — CPF: {{ p.cpf }}</mat-option>
            </mat-select>
            <mat-error>Selecione um paciente</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Profissional</mat-label>
            <mat-select formControlName="professionalId">
              <mat-option *ngFor="let p of professionals" [value]="p.id">{{ p.name }} — {{ p.specialty }}</mat-option>
            </mat-select>
            <mat-error>Selecione um profissional</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Data e Hora</mat-label>
            <input matInput type="datetime-local" formControlName="dateTime" />
            <mat-error>Data e hora são obrigatórias</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Tipo de Atendimento</mat-label>
            <mat-select formControlName="type">
              <mat-option value="CONSULTA">Consulta</mat-option>
              <mat-option value="RETORNO">Retorno</mat-option>
              <mat-option value="EXAME">Exame</mat-option>
            </mat-select>
            <mat-error>Selecione o tipo</mat-error>
          </mat-form-field>

          <div style="display: flex; gap: 12px;">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
              <mat-icon>save</mat-icon> Agendar
            </button>
            <button mat-button type="button" routerLink="/appointments">Cancelar</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class NewAppointmentComponent implements OnInit {
  patients: Patient[] = [];
  professionals: Professional[] = [];
  loading = false;

  form = this.fb.group({
    patientId: [null, Validators.required],
    professionalId: [null, Validators.required],
    dateTime: ['', Validators.required],
    type: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private professionalService: ProfessionalService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.patientService.getAll().subscribe(d => this.patients = d);
    this.professionalService.getAll().subscribe(d => this.professionals = d);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    const raw = this.form.value;
    const dt = raw.dateTime!;
    const payload: CreateAppointmentRequest = {
      patientId: raw.patientId!,
      professionalId: raw.professionalId!,
      dateTime: dt.length === 16 ? dt + ':00' : dt,
      type: raw.type as AppointmentType
    };

    this.appointmentService.create(payload).subscribe({
      next: () => {
        this.snack.open('Agendamento criado com sucesso!', 'OK', { duration: 3000 });
        this.router.navigate(['/appointments']);
      },
      error: (err) => {
        this.snack.open(err.error?.message || 'Erro ao criar agendamento.', 'OK', { duration: 4000 });
        this.loading = false;
      }
    });
  }
}
