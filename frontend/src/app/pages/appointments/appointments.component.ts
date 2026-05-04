import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentService } from '../../core/services/appointment.service';
import { PatientService } from '../../core/services/patient.service';
import { ProfessionalService } from '../../core/services/professional.service';
import { Appointment, AppointmentFilters, AppointmentStatus, Patient, Professional } from '../../core/models/models';
import { CancelDialogComponent } from './cancel-dialog.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatTableModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatDialogModule, MatSnackBarModule
  ],
  template: `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2><mat-icon>calendar_month</mat-icon> Agendamentos</h2>
      <a mat-raised-button color="primary" routerLink="/appointments/new">
        <mat-icon>add</mat-icon> Novo Agendamento
      </a>
    </div>

    <mat-card style="margin-bottom: 24px;">
      <mat-card-content>
        <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 8px; align-items: flex-end;">
          <mat-form-field appearance="outline">
            <mat-label>Paciente</mat-label>
            <mat-select formControlName="patientId">
              <mat-option [value]="null">Todos</mat-option>
              <mat-option *ngFor="let p of patients" [value]="p.id">{{ p.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Profissional</mat-label>
            <mat-select formControlName="professionalId">
              <mat-option [value]="null">Todos</mat-option>
              <mat-option *ngFor="let p of professionals" [value]="p.id">{{ p.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option [value]="null">Todos</mat-option>
              <mat-option value="AGENDADO">AGENDADO</mat-option>
              <mat-option value="CANCELADO">CANCELADO</mat-option>
              <mat-option value="CONCLUIDO">CONCLUÍDO</mat-option>
            </mat-select>
          </mat-form-field>
          <div>
            <button mat-raised-button color="accent" type="submit">
              <mat-icon>filter_list</mat-icon> Filtrar
            </button>
            <button mat-button type="button" (click)="clearFilters()" style="margin-left: 8px;">Limpar</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="appointments" style="width: 100%; margin-top: 8px;">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let a">{{ a.id }}</td>
          </ng-container>
          <ng-container matColumnDef="patient">
            <th mat-header-cell *matHeaderCellDef>Paciente</th>
            <td mat-cell *matCellDef="let a">{{ a.patient.name }}</td>
          </ng-container>
          <ng-container matColumnDef="professional">
            <th mat-header-cell *matHeaderCellDef>Profissional</th>
            <td mat-cell *matCellDef="let a">{{ a.professional.name }}</td>
          </ng-container>
          <ng-container matColumnDef="dateTime">
            <th mat-header-cell *matHeaderCellDef>Data/Hora</th>
            <td mat-cell *matCellDef="let a">{{ a.dateTime + 'Z' | date:'dd/MM/yyyy HH:mm':'UTC' }}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let a">{{ a.type }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let a">
              <span [class]="'status-badge status-' + a.status.toLowerCase()">{{ a.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let a">
              <button mat-icon-button color="primary"
                [disabled]="a.status !== 'AGENDADO'"
                (click)="complete(a)"
                title="Concluir agendamento">
                <mat-icon>check_circle</mat-icon>
              </button>
              <button mat-icon-button color="warn"
                [disabled]="a.status !== 'AGENDADO'"
                (click)="openCancelDialog(a)"
                title="Cancelar agendamento">
                <mat-icon>cancel</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <p *ngIf="appointments.length === 0" style="text-align: center; color: #888; padding: 24px;">
          Nenhum agendamento encontrado.
        </p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-agendado { background: #e3f2fd; color: #1565c0; }
    .status-cancelado { background: #fce4ec; color: #b71c1c; }
    .status-concluido { background: #e8f5e9; color: #2e7d32; }
  `]
})
export class AppointmentsComponent implements OnInit {
  columns = ['id', 'patient', 'professional', 'dateTime', 'type', 'status', 'actions'];
  appointments: Appointment[] = [];
  patients: Patient[] = [];
  professionals: Professional[] = [];

  filterForm = this.fb.group({
    patientId: [null],
    professionalId: [null],
    status: [null]
  });

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private professionalService: ProfessionalService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.load();
    this.patientService.getAll().subscribe(d => this.patients = d);
    this.professionalService.getAll().subscribe(d => this.professionals = d);
  }

  load(filters = {}) {
    this.appointmentService.getAll(filters).subscribe(data => this.appointments = data);
  }

  applyFilters() {
    const raw = this.filterForm.value;
    const filters: AppointmentFilters = {};
    if (raw.patientId) filters.patientId = raw.patientId;
    if (raw.professionalId) filters.professionalId = raw.professionalId;
    if (raw.status) filters.status = raw.status as AppointmentStatus;
    this.load(filters);
  }

  clearFilters() {
    this.filterForm.reset();
    this.load();
  }

  complete(appointment: Appointment) {
    this.appointmentService.complete(appointment.id).subscribe({
      next: () => {
        this.snack.open('Agendamento concluído.', 'OK', { duration: 3000 });
        this.load();
      },
      error: (err) => {
        this.snack.open(err.error?.message || 'Erro ao concluir agendamento.', 'OK', { duration: 4000 });
      }
    });
  }

  openCancelDialog(appointment: Appointment) {
    const ref = this.dialog.open(CancelDialogComponent, {
      width: '400px',
      data: appointment
    });
    ref.afterClosed().subscribe(reason => {
      if (reason) {
        this.appointmentService.cancel(appointment.id, { reason }).subscribe({
          next: () => {
            this.snack.open('Agendamento cancelado.', 'OK', { duration: 3000 });
            this.load();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Erro ao cancelar.', 'OK', { duration: 4000 });
          }
        });
      }
    });
  }
}
