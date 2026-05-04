import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>local_hospital</mat-icon>
      <span style="margin-left: 8px; font-weight: 600;">Clínica Agendamentos</span>
      <span style="flex: 1"></span>
      <a mat-button routerLink="/appointments" routerLinkActive="active-link">
        <mat-icon>calendar_month</mat-icon> Agendamentos
      </a>
      <a mat-button routerLink="/appointments/new" routerLinkActive="active-link">
        <mat-icon>add_circle</mat-icon> Novo
      </a>
      <a mat-button routerLink="/patients" routerLinkActive="active-link">
        <mat-icon>people</mat-icon> Pacientes
      </a>
      <a mat-button routerLink="/professionals" routerLinkActive="active-link">
        <mat-icon>medical_services</mat-icon> Profissionais
      </a>
    </mat-toolbar>

    <main style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <router-outlet />
    </main>
  `,
  styles: [`
    .active-link { background: rgba(255,255,255,0.15); border-radius: 4px; }
    mat-toolbar mat-icon { font-size: 28px; }
  `]
})
export class AppComponent {}
