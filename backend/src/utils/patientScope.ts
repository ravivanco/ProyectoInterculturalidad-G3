import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authGuard';

/** Resuelve el paciente objetivo: el JWT del paciente o query ?patientId= para nutricionista. */
export const resolvePatientId = (
  req: AuthenticatedRequest,
  res: Response
): string | null => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized.' });
    return null;
  }

  if (req.user.role === 'paciente') {
    return req.user.userId;
  }

  const fromQuery = req.query.patientId ?? req.body?.patientId;
  if (typeof fromQuery === 'string' && fromQuery.length > 0) {
    return fromQuery;
  }

  res.status(400).json({
    success: false,
    message: 'Nutritionist must provide patientId (query or body).',
  });
  return null;
};
