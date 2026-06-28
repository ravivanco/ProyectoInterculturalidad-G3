import type { RegisterPayload } from '../types/auth';

export type RegisterErrors = Partial<Record<keyof RegisterPayload, string>>;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(payload: RegisterPayload): RegisterErrors {
  const errors: RegisterErrors = {};
  if (!payload.nombres.trim()) errors.nombres = 'Ingresa tus nombres.';
  if (!payload.apellidos.trim()) errors.apellidos = 'Ingresa tus apellidos.';
  if (!EMAIL_PATTERN.test(payload.correo.trim())) errors.correo = 'Ingresa un correo válido.';
  if (payload.password.length < 8) errors.password = 'Usa al menos 8 caracteres.';
  if (!payload.sexo) errors.sexo = 'Selecciona una opción.';
  if (!payload.fecha_nacimiento) errors.fecha_nacimiento = 'Selecciona tu fecha de nacimiento.';
  return errors;
}
