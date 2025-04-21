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