import {
  NextFunction,
  Request,
  Response,
} from "express";

import AdditionalIntake from "../models/AdditionalIntake";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { analyzeFoodImage } from "../utils/gemini";

interface CreateAdditionalIntakeBody {
  userId?: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  imageUrl?: string;
}

const isValidNonNegativeNumber = (
  value: unknown
): boolean => {
  const numberValue = Number(value);

  return (
    Number.isFinite(numberValue) &&
    numberValue >= 0
  );
};

export const createAdditionalIntake = async (
  req: Request<
    Record<string, never>,
    unknown,
    CreateAdditionalIntakeBody
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      description,
      calories,
      protein = 0,
      carbs = 0,
      fat = 0,
      imageUrl,
    } = req.body;

    if (!userId?.trim()) {
      res.status(400).json({
        success: false,
        message: "El userId es obligatorio",
      });
      return;
    }

    if (!description?.trim()) {
      res.status(400).json({
        success: false,
        message: "La descripción es obligatoria",
      });
      return;
    }

    if (
      !isValidNonNegativeNumber(calories) ||
      !isValidNonNegativeNumber(protein) ||
      !isValidNonNegativeNumber(carbs) ||
      !isValidNonNegativeNumber(fat)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Las calorías y macronutrientes deben ser números mayores o iguales a cero",
      });
      return;
    }

    const intake = await AdditionalIntake.create({
      userId: userId.trim(),
      description: description.trim(),
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      imageUrl: imageUrl?.trim() || null,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message:
        "Consumo adicional creado correctamente",
      data: intake,
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeAdditionalIntake = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message:
          "Debes enviar una imagen en el campo image",
      });
      return;
    }

    const [imageUrl, analysis] =
      await Promise.all([
        uploadImageToCloudinary(req.file.buffer),
        analyzeFoodImage(
          req.file.buffer,
          req.file.mimetype
        ),
      ]);

    res.status(200).json({
      success: true,
      message:
        "Imagen analizada correctamente",
      data: {
        imageUrl,
        description: analysis.description,
        calories: analysis.calories,
        macros: {
          protein: analysis.protein,
          carbs: analysis.carbs,
          fat: analysis.fat,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const confirmAdditionalIntake = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const intake = await AdditionalIntake.findByPk(
      req.params.id
    );

    if (!intake) {
      res.status(404).json({
        success: false,
        message:
          "No se encontró el consumo adicional",
      });
      return;
    }

    if (intake.status === "confirmed") {
      res.status(409).json({
        success: false,
        message:
          "El consumo ya fue confirmado",
      });
      return;
    }

    if (intake.status === "discarded") {
      res.status(409).json({
        success: false,
        message:
          "No se puede confirmar un consumo descartado",
      });
      return;
    }

    intake.status = "confirmed";
    intake.confirmedAt = new Date();

    await intake.save();

    res.status(200).json({
      success: true,
      message:
        "Consumo adicional confirmado correctamente",
      data: intake,
    });
  } catch (error) {
    next(error);
  }
};

export const discardAdditionalIntake = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const intake = await AdditionalIntake.findByPk(
      req.params.id
    );

    if (!intake) {
      res.status(404).json({
        success: false,
        message:
          "No se encontró el consumo adicional",
      });
      return;
    }

    if (intake.status === "confirmed") {
      res.status(409).json({
        success: false,
        message:
          "No se puede descartar un consumo confirmado",
      });
      return;
    }

    if (intake.status === "discarded") {
      res.status(409).json({
        success: false,
        message:
          "El consumo ya fue descartado",
      });
      return;
    }

    intake.status = "discarded";
    intake.discardedAt = new Date();

    await intake.save();

    res.status(200).json({
      success: true,
      message:
        "Consumo adicional descartado correctamente",
      data: intake,
    });
  } catch (error) {
    next(error);
  }
};