import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export interface TokenPayload {
  userId: string;
  role: 'paciente' | 'nutricionista';
  email: string;
}

export const generateAccessToken = (user: { id: string; role: 'paciente' | 'nutricionista'; email: string }): string => {
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: { id: string; role: 'paciente' | 'nutricionista'; email: string }): string => {
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};
