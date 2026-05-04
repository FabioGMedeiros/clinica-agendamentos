import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Appointment } from '../../core/models/models';

@Component({
  selector: 'app-cancel-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Cancelar Agendamento #{{ data.id }}</h2>
    <mat-dialog-content>
      <p style="color: #555; margin-bottom: 16px;">
        Paciente: <strong>{{ data.patient.name }}</strong><br>
        Profissional: <strong>{{ data.professional.name }}</strong>
      </p>
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Motivo do cancelamento</mat-label>
        <textarea matInput [formControl]="reasonControl" rows="3"></textarea>
        <mat-error *ngIf="reasonControl.invalid">Motivo é obrigatório</mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Voltar</button>
      <button mat-raised-button color="warn"
        [disabled]="reasonControl.invalid"
        (click)="confirm()">
        Confirmar Cancelamento
      </button>
    </mat-dialog-actions>
  `
})
export class CancelDialogComponent {
  reasonControl = this.fb.control('', Validators.required);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment
  ) {}

  confirm() {
    if (this.reasonControl.valid) {
      this.dialogRef.close(this.reasonControl.value);
    }
  }
}
