import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'appointments', pathMatch: 'full' },
  {
    path: 'patients',
    loadComponent: () =>
      import('./pages/patients/patients.component').then(m => m.PatientsComponent)
  },
  {
    path: 'professionals',
    loadComponent: () =>
      import('./pages/professionals/professionals.component').then(m => m.ProfessionalsComponent)
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent)
  },
  {
    path: 'appointments/new',
    loadComponent: () =>
      import('./pages/appointments/new-appointment.component').then(m => m.NewAppointmentComponent)
  }
];
