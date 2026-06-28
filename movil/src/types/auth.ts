export type Sex = 'F' | 'M' | 'OTRO';

export type RegisterPayload = {
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
  sexo: Sex;
  fecha_nacimiento: string;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  perfil_completado: boolean;
};

export type LoginPayload = {
  correo: string;
  password: string;
};
