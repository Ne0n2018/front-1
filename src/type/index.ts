export enum Role {
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN",
}

export interface Doctor {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Patient {
  id: string;
  fullName: string;
  birthDate: string;
  medicalHistory: string;
  medicalReport: Medicalreport[];
  reaserch: Reaserch[];
}

export interface Medicalreport {
  id: string;
  doctorId: string;
  patientId: string;
  reportType: string;
  diagnosis?: string;
  findings?: JSON;
  conclusion?: string;
}

export interface Reaserch {
  id: string;
  patientId: string;
  type: string;
  data?: JSON;
  status: "PENDING" | "COMPLETED" | "REWIEWD";
}
