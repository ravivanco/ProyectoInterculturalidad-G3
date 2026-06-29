import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, PatientProfile, NutritionistProfile, sequelize } from '../models';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Email, password and role are required.',
    });
    return;
  }

  if (role !== 'paciente' && role !== 'nutricionista') {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid role. Must be either paciente or nutricionista.',
    });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      await transaction.rollback();
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Email is already registered.',
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create(
      {
        email,
        password: hashedPassword,
        role,
      },
      { transaction }
    );

    // Create profile depending on role
    if (role === 'paciente') {
      await PatientProfile.create(
        {
          userId: newUser.id,
          estado_tratamiento: 'pendiente',
        },
        { transaction }
      );
    } else {
      await NutritionistProfile.create(
        {
          userId: newUser.id,
        },
        { transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully.',
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error registering user.',
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Email and password are required.',
    });
    return;
  }

  try {
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials.',
      });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials.',
      });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login successful.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error during login.',
      error: error.message,
    });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Refresh token is required.',
    });
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    // Verify user still exists
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'User does not exist.',
      });
      return;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Token refreshed successfully.',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid or expired refresh token.',
      error: error.message,
    });
  }
};
