import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professional } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfessionalService {
  private readonly url = `${environment.apiUrl}/professionals`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Professional[]> {
    return this.http.get<Professional[]>(this.url);
  }

  create(data: Omit<Professional, 'id'>): Observable<Professional> {
    return this.http.post<Professional>(this.url, data);
  }
}
