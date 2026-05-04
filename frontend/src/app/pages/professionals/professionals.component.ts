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
import { ProfessionalService } from '../../core/services/professional.service';
import { Professional } from '../../core/models/models';

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSnackBarModule, MatIconModule
  ],
  template: `
    <h2><mat-icon>medical_services</mat-icon> Profissionais</h2>

    <mat-card style="margin-bottom: 24px;">
      <mat-card-header>
        <mat-card-title>Cadastrar Profissional</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()" style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;">
          <mat-form-field appearance="outline">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Especialidade</mat-label>
            <input matInput formControlName="specialty" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>CRM</mat-label>
            <input matInput formControlName="crm" />
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
        <mat-card-title>Lista de Profissionais</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="professionals" style="width: 100%; margin-top: 16px;">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let p">{{ p.id }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let p">{{ p.name }}</td>
          </ng-container>
          <ng-container matColumnDef="specialty">
            <th mat-header-cell *matHeaderCellDef>Especialidade</th>
            <td mat-cell *matCellDef="let p">{{ p.specialty }}</td>
          </ng-container>
          <ng-container matColumnDef="crm">
            <th mat-header-cell *matHeaderCellDef>CRM</th>
            <td mat-cell *matCellDef="let p">{{ p.crm }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <p *ngIf="professionals.length === 0" style="text-align: center; color: #888; padding: 24px;">
          Nenhum profissional cadastrado.
        </p>
      </mat-card-content>
    </mat-card>
  `
})
export class ProfessionalsComponent implements OnInit {
  columns = ['id', 'name', 'specialty', 'crm'];
  professionals: Professional[] = [];
  loading = false;

  form = this.fb.group({
    name: ['', Validators.required],
    specialty: ['', Validators.required],
    crm: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.professionalService.getAll().subscribe(data => this.professionals = data);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.professionalService.create(this.form.value as any).subscribe({
      next: () => {
        this.snack.open('Profissional cadastrado com sucesso!', 'OK', { duration: 3000 });
        this.form.reset();
        this.load();
        this.loading = false;
      },
      error: (err) => {
        this.snack.open(err.error?.message || 'Erro ao cadastrar profissional.', 'OK', { duration: 4000 });
        this.loading = false;
      }
    });
  }
}
