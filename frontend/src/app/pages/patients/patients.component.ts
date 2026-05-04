import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { PatientService } from '../../core/services/patient.service';
import { Patient } from '../../core/models/models';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSnackBarModule, MatIconModule
  ],
  template: `
    <h2><mat-icon>people</mat-icon> Pacientes</h2>

    <mat-card style="margin-bottom: 24px;">
      <mat-card-header>
        <mat-card-title>Cadastrar Paciente</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()" style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;">
          <mat-form-field appearance="outline">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>CPF (somente números)</mat-label>
            <input matInput formControlName="cpf" maxlength="11" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Telefone</mat-label>
            <input matInput formControlName="phone" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>E-mail</mat-label>
            <input matInput formControlName="email" type="email" />
          </mat-form-field>
          <div style="display: flex; align-items: center;">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
              <mat-icon>save</mat-icon> Cadastrar
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-header>
        <mat-card-title>Lista de Pacientes</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="patients" style="width: 100%; margin-top: 16px;">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let p">{{ p.id }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let p">{{ p.name }}</td>
          </ng-container>
          <ng-container matColumnDef="cpf">
            <th mat-header-cell *matHeaderCellDef>CPF</th>
            <td mat-cell *matCellDef="let p">{{ p.cpf }}</td>
          </ng-container>
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Telefone</th>
            <td mat-cell *matCellDef="let p">{{ p.phone }}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>E-mail</th>
            <td mat-cell *matCellDef="let p">{{ p.email }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <p *ngIf="patients.length === 0" style="text-align: center; color: #888; padding: 24px;">
          Nenhum paciente cadastrado.
        </p>
      </mat-card-content>
    </mat-card>
  `
})
export class PatientsComponent implements OnInit {
  columns = ['id', 'name', 'cpf', 'phone', 'email'];
  patients: Patient[] = [];
  loading = false;

  form = this.fb.group({
    name: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.patientService.getAll().subscribe(data => this.patients = data);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.patientService.create(this.form.value as any).subscribe({
      next: () => {
        this.snack.open('Paciente cadastrado com sucesso!', 'OK', { duration: 3000 });
        this.form.reset();
        this.load();
        this.loading = false;
      },
      error: (err) => {
        this.snack.open(err.error?.message || 'Erro ao cadastrar paciente.', 'OK', { duration: 4000 });
        this.loading = false;
      }
    });
  }
}
