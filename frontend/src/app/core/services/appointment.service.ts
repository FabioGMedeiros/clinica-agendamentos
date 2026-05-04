import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Appointment,
  AppointmentFilters,
  CancelAppointmentRequest,
  CreateAppointmentRequest
} from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly url = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAll(filters: AppointmentFilters = {}): Observable<Appointment[]> {
    let params = new HttpParams();
    if (filters.patientId) params = params.set('patientId', filters.patientId);
    if (filters.professionalId) params = params.set('professionalId', filters.professionalId);
    if (filters.status) params = params.set('status', filters.status);
    return this.http.get<Appointment[]>(this.url, { params });
  }

  create(data: CreateAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.url, data);
  }

  cancel(id: number, data: CancelAppointmentRequest): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.url}/${id}/cancel`, data);
  }

  complete(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.url}/${id}/complete`, {});
  }
}
