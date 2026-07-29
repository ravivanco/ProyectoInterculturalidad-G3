import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

import User from "../models/User";
import MealLog from "../models/MealLog";
import Alert from "../models/Alert";

type MealLogRecord = {
  patientId?: string;
  createdAt?: Date | string;
};

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  return result;
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
};

const toDateKey = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

const roundTwo = (value: number): number => {
  return Math.round(value * 100) / 100;
};

const calculateVariation = (
  currentValue: number,
  previousValue: number
): number => {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return roundTwo(
    ((currentValue - previousValue) / previousValue) * 100
  );
};

export const getNutritionistDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);

    // Semana actual: últimos 7 días, incluyendo hoy.
    const currentWeekStart = addDays(today, -6);

    // Semana anterior: los 7 días anteriores.
    const previousWeekStart = addDays(today, -13);
    const previousWeekEnd = currentWeekStart;

    const patients = await User.findAll({
      where: {
        role: "paciente",
      },
      attributes: ["id"],
      raw: true,
    });

    const patientIds = patients
      .map((patient) => patient.id)
      .filter(
        (id): id is string =>
          typeof id === "string"
      );

    const totalPatients = patientIds.length;

    if (totalPatients === 0) {
      res.status(200).json({
        success: true,
        message:
          "KPIs del dashboard obtenidos correctamente",
        data: {
          total_pacientes: 0,
          pacientes_activos: 0,
          promedio_adherencia: 0,
          alertas_nuevas: 0,
          pacientes_en_riesgo: 0,

          comparativa_semana_anterior: {
            datos_semana_anterior: {
              total_pacientes: 0,
              pacientes_activos: 0,
              promedio_adherencia: 0,
              alertas_nuevas: 0,
              pacientes_en_riesgo: 0,
            },

            variacion_porcentual: {
              total_pacientes: 0,
              pacientes_activos: 0,
              promedio_adherencia: 0,
              alertas_nuevas: 0,
              pacientes_en_riesgo: 0,
            },
          },
        },
      });

      return;
    }

    const mealLogs = (await MealLog.findAll({
      where: {
        patientId: {
          [Op.in]: patientIds,
        },

        createdAt: {
          [Op.gte]: previousWeekStart,
          [Op.lt]: tomorrow,
        },
      },

      raw: true,
    })) as unknown as MealLogRecord[];

    const currentDaysByPatient =
      new Map<string, Set<string>>();

    const previousDaysByPatient =
      new Map<string, Set<string>>();

    const activePatientsToday = new Set<string>();

    const activePatientsPreviousWeek =
      new Set<string>();

    patientIds.forEach((patientId) => {
      currentDaysByPatient.set(
        patientId,
        new Set<string>()
      );

      previousDaysByPatient.set(
        patientId,
        new Set<string>()
      );
    });

    mealLogs.forEach((mealLog) => {
      if (
        !mealLog.patientId ||
        !mealLog.createdAt
      ) {
        return;
      }

      const createdAt = new Date(
        mealLog.createdAt
      );

      if (Number.isNaN(createdAt.getTime())) {
        return;
      }

      const patientId = String(
        mealLog.patientId
      );

      const recordDate = toDateKey(createdAt);

      // Pacientes activos durante el día actual.
      if (
        createdAt >= today &&
        createdAt < tomorrow
      ) {
        activePatientsToday.add(patientId);
      }

      // Días con registros durante la semana actual.
      if (
        createdAt >= currentWeekStart &&
        createdAt < tomorrow
      ) {
        currentDaysByPatient
          .get(patientId)
          ?.add(recordDate);
      }

      // Días con registros durante la semana anterior.
      if (
        createdAt >= previousWeekStart &&
        createdAt < previousWeekEnd
      ) {
        previousDaysByPatient
          .get(patientId)
          ?.add(recordDate);

        activePatientsPreviousWeek.add(
          patientId
        );
      }
    });

    const currentAdherences = patientIds.map(
      (patientId) => {
        const registeredDays =
          currentDaysByPatient.get(patientId)
            ?.size ?? 0;

        return (registeredDays / 7) * 100;
      }
    );

    const previousAdherences = patientIds.map(
      (patientId) => {
        const registeredDays =
          previousDaysByPatient.get(patientId)
            ?.size ?? 0;

        return (registeredDays / 7) * 100;
      }
    );

    const currentAverageAdherence =
      currentAdherences.reduce(
        (total, value) => total + value,
        0
      ) / totalPatients;

    const previousAverageAdherence =
      previousAdherences.reduce(
        (total, value) => total + value,
        0
      ) / totalPatients;

    const currentPatientsAtRisk =
      currentAdherences.filter(
        (value) => value < 50
      ).length;

    const previousPatientsAtRisk =
      previousAdherences.filter(
        (value) => value < 50
      ).length;

    const newAlerts = await Alert.count({
      where: {
        userId: {
          [Op.in]: patientIds,
        },

        status: "activa",

        detectedAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
    });

    const previousAlerts = await Alert.count({
      where: {
        userId: {
          [Op.in]: patientIds,
        },

        detectedAt: {
          [Op.gte]: previousWeekStart,
          [Op.lt]: previousWeekEnd,
        },
      },
    });

    const currentData = {
      total_pacientes: totalPatients,

      pacientes_activos:
        activePatientsToday.size,

      promedio_adherencia: roundTwo(
        currentAverageAdherence
      ),

      alertas_nuevas: newAlerts,

      pacientes_en_riesgo:
        currentPatientsAtRisk,
    };

    const previousData = {
      total_pacientes: totalPatients,

      pacientes_activos:
        activePatientsPreviousWeek.size,

      promedio_adherencia: roundTwo(
        previousAverageAdherence
      ),

      alertas_nuevas: previousAlerts,

      pacientes_en_riesgo:
        previousPatientsAtRisk,
    };

    res.status(200).json({
      success: true,

      message:
        "KPIs del dashboard obtenidos correctamente",

      data: {
        ...currentData,

        comparativa_semana_anterior: {
          datos_semana_anterior:
            previousData,

          variacion_porcentual: {
            total_pacientes:
              calculateVariation(
                currentData.total_pacientes,
                previousData.total_pacientes
              ),

            pacientes_activos:
              calculateVariation(
                currentData.pacientes_activos,
                previousData.pacientes_activos
              ),

            promedio_adherencia:
              calculateVariation(
                currentData.promedio_adherencia,
                previousData.promedio_adherencia
              ),

            alertas_nuevas:
              calculateVariation(
                currentData.alertas_nuevas,
                previousData.alertas_nuevas
              ),

            pacientes_en_riesgo:
              calculateVariation(
                currentData.pacientes_en_riesgo,
                previousData.pacientes_en_riesgo
              ),
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};