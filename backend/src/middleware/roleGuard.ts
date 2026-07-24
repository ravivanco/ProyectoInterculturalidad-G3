import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authGuard';

export const roleGuard = (allowedRoles: ('paciente' | 'nutricionista')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Unauthorized. Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Forbidden. You do not have permission to access this resource.',
      });
      return;
    }

    next();
  };
};
