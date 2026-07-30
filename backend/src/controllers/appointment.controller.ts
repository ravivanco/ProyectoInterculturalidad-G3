import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  Op,
  WhereOptions,
} from "sequelize";

import Appointment, {
  AppointmentAttributes,
  AppointmentStatus,
} from "../models/Appointment";

const validStatuses: AppointmentStatus[] = [
  "programada",
  "confirmada",
  "completada",
  "cancelada",
];

const isValidUuid = (value: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
};

const isValidDate = (value: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

const isValidTime = (value: string): boolean => {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(
    value
  );
};

interface CreateAppointmentBody {
  patientId?: string;
  nutritionistId?: string;
  date?: string;
  time?: string;
  status?: AppointmentStatus;
}

interface AppointmentFilters {
  patientId?: string;
  nutritionistId?: string;
  date?: string;
  status?: AppointmentStatus;
}

interface UpdateStatusBody {
  status?: AppointmentStatus;
}

interface LinkEvaluationBody {
  evaluationId?: string;
}

/**
 * POST /api/appointments
 */
export const createAppointment = async (
  req: Request<
    Record<string, never>,
    unknown,
    CreateAppointmentBody
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      patientId,
      nutritionistId,
      date,
      time,
      status = "programada",
    } = req.body;

    if (
      !patientId ||
      !nutritionistId ||
      !date ||
      !time
    ) {
      res.status(400).json({
        success: false,
        message:
          "patientId, nutritionistId, date y time son obligatorios",
      });

      return;
    }

    if (
      !isValidUuid(patientId) ||
      !isValidUuid(nutritionistId)
    ) {
      res.status(400).json({
        success: false,
        message:
          "patientId y nutritionistId deben ser UUID válidos",
      });

      return;
    }

    if (!isValidDate(date)) {
      res.status(400).json({
        success: false,
        message:
          "La fecha debe tener formato YYYY-MM-DD",
      });

      return;
    }

    if (!isValidTime(time)) {
      res.status(400).json({
        success: false,
        message:
          "La hora debe tener formato HH:mm o HH:mm:ss",
      });

      return;
    }

    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Estado de cita no válido",
        allowedStatuses: validStatuses,
      });

      return;
    }

    const conflictingAppointment =
      await Appointment.findOne({
        where: {
          nutritionistId,
          date,
          time,
          status: {
            [Op.ne]: "cancelada",
          },
        },
      });

    if (conflictingAppointment) {
      res.status(409).json({
        success: false,
        message:
          "El nutricionista ya tiene una cita en esa fecha y hora",
      });

      return;
    }

    const appointment =
      await Appointment.create({
        patientId,
        nutritionistId,
        date,
        time,
        status,
        evaluationId: null,
      });

    res.status(201).json({
      success: true,
      message: "Cita creada correctamente",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/appointments
 *
 * Filtros:
 * patientId
 * nutritionistId
 * date
 * status
 */
export const getAppointments = async (
  req: Request<
    Record<string, never>,
    unknown,
    unknown,
    AppointmentFilters
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      patientId,
      nutritionistId,
      date,
      status,
    } = req.query;

    const where: WhereOptions<AppointmentAttributes> =
      {};

    if (patientId) {
      if (!isValidUuid(patientId)) {
        res.status(400).json({
          success: false,
          message:
            "patientId debe ser un UUID válido",
        });

        return;
      }

      where.patientId = patientId;
    }

    if (nutritionistId) {
      if (!isValidUuid(nutritionistId)) {
        res.status(400).json({
          success: false,
          message:
            "nutritionistId debe ser un UUID válido",
        });

        return;
      }

      where.nutritionistId = nutritionistId;
    }

    if (date) {
      if (!isValidDate(date)) {
        res.status(400).json({
          success: false,
          message:
            "La fecha debe tener formato YYYY-MM-DD",
        });

        return;
      }

      where.date = date;
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: "Estado de cita no válido",
          allowedStatuses: validStatuses,
        });

        return;
      }

      where.status = status;
    }

    const appointments =
      await Appointment.findAll({
        where,
        order: [
          ["date", "ASC"],
          ["time", "ASC"],
        ],
      });

    res.status(200).json({
      success: true,
      message: "Citas obtenidas correctamente",
      total: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/appointments/:id/status
 */
export const updateAppointmentStatus = async (
  req: Request<
    { id: string },
    unknown,
    UpdateStatusBody
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidUuid(id)) {
      res.status(400).json({
        success: false,
        message: "El ID de la cita no es válido",
      });

      return;
    }

    if (
      !status ||
      !validStatuses.includes(status)
    ) {
      res.status(400).json({
        success: false,
        message: "Estado de cita no válido",
        allowedStatuses: validStatuses,
      });

      return;
    }

    const appointment =
      await Appointment.findByPk(id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Cita no encontrada",
      });

      return;
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Estado de la cita actualizado correctamente",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/appointments/:id/link-evaluation
 */
export const linkAppointmentEvaluation = async (
  req: Request<
    { id: string },
    unknown,
    LinkEvaluationBody
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { evaluationId } = req.body;

    if (!isValidUuid(id)) {
      res.status(400).json({
        success: false,
        message: "El ID de la cita no es válido",
      });

      return;
    }

    if (
      !evaluationId ||
      !isValidUuid(evaluationId)
    ) {
      res.status(400).json({
        success: false,
        message:
          "evaluationId debe ser un UUID válido",
      });

      return;
    }

    const appointment =
      await Appointment.findByPk(id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Cita no encontrada",
      });

      return;
    }

    appointment.evaluationId = evaluationId;
    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Evaluación vinculada correctamente",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/appointments/:id
 */
export const deleteAppointment = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidUuid(id)) {
      res.status(400).json({
        success: false,
        message: "El ID de la cita no es válido",
      });

      return;
    }

    const appointment =
      await Appointment.findByPk(id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Cita no encontrada",
      });

      return;
    }

    await appointment.destroy();

    res.status(200).json({
      success: true,
      message: "Cita eliminada correctamente",
      data: {
        id,
      },
    });
  } catch (error) {
    next(error);
  }
};