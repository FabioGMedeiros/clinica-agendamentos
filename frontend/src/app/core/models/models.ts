export interface Patient {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  email: string;
}

export interface Professional {
  id: number;
  name: string;
  specialty: string;
  crm: string;
}

export type AppointmentStatus = 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO';
export type AppointmentType = 'CONSULTA' | 'RETORNO' | 'EXAME';

export interface Appointment {
  id: number;
  patient: Patient;
  professional: Professional;
  dateTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  cancelReason?: string;
}

export interface CreateAppointmentRequest {
  patientId: number;
  professionalId: number;
  dateTime: string;
  type: AppointmentType;
}

export interface CancelAppointmentRequest {
  reason: string;
}

export interface AppointmentFilters {
  patientId?: number;
  professionalId?: number;
  status?: AppointmentStatus;
}
