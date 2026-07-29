import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type AlertType =
  | "BAJA_ADHERENCIA"
  | "INACTIVIDAD"
  | "EXCESO_CALORICO";

export type AlertSeverity =
  | "baja"
  | "media"
  | "alta";

export type AlertStatus =
  | "activa"
  | "leida"
  | "resuelta";

export interface AlertAttributes {
  id: string;
  userId: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  metadata: Record<string, unknown> | null;
  detectedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AlertCreationAttributes
  extends Optional<
    AlertAttributes,
    | "id"
    | "severity"
    | "status"
    | "metadata"
    | "detectedAt"
    | "createdAt"
    | "updatedAt"
  > {}

export class Alert
  extends Model<
    AlertAttributes,
    AlertCreationAttributes
  >
  implements AlertAttributes
{
  public id!: string;
  public userId!: string;
  public type!: AlertType;
  public severity!: AlertSeverity;
  public status!: AlertStatus;
  public message!: string;
  public metadata!: Record<string, unknown> | null;
  public detectedAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Alert.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },

    type: {
      type: DataTypes.ENUM(
        "BAJA_ADHERENCIA",
        "INACTIVIDAD",
        "EXCESO_CALORICO"
      ),
      allowNull: false,
    },

    severity: {
      type: DataTypes.ENUM(
        "baja",
        "media",
        "alta"
      ),
      allowNull: false,
      defaultValue: "media",
    },

    status: {
      type: DataTypes.ENUM(
        "activa",
        "leida",
        "resuelta"
      ),
      allowNull: false,
      defaultValue: "activa",
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    detectedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "detected_at",
    },
  },
  {
    sequelize,
    tableName: "alerts",
    modelName: "Alert",
    timestamps: true,
    indexes: [
      {
        fields: [
          "user_id",
          "type",
          "status",
        ],
      },
    ],
  }
);

export default Alert;