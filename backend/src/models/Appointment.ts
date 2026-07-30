import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";

import sequelize from "../config/database";

export type AppointmentStatus =
  | "programada"
  | "confirmada"
  | "completada"
  | "cancelada";

export interface AppointmentAttributes {
  id: string;
  patientId: string;
  nutritionistId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  evaluationId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppointmentCreationAttributes
  extends Optional<
    AppointmentAttributes,
    | "id"
    | "status"
    | "evaluationId"
    | "createdAt"
    | "updatedAt"
  > {}

export class Appointment
  extends Model<
    AppointmentAttributes,
    AppointmentCreationAttributes
  >
  implements AppointmentAttributes
{
  public id!: string;
  public patientId!: string;
  public nutritionistId!: string;
  public date!: string;
  public time!: string;
  public status!: AppointmentStatus;
  public evaluationId!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "patient_id",
    },

    nutritionistId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "nutritionist_id",
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "programada",
        "confirmada",
        "completada",
        "cancelada"
      ),
      allowNull: false,
      defaultValue: "programada",
    },

    evaluationId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "evaluation_id",
    },
  },
  {
    sequelize,
    tableName: "appointments",
    modelName: "Appointment",
    timestamps: true,
    indexes: [
      {
        fields: ["patient_id"],
      },
      {
        fields: ["nutritionist_id"],
      },
      {
        fields: ["date"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

export default Appointment;