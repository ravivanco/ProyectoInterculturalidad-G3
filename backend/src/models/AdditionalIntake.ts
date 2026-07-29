import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type AdditionalIntakeStatus =
  | "pending"
  | "confirmed"
  | "discarded";

export interface AdditionalIntakeAttributes {
  id: string;
  userId: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl: string | null;
  status: AdditionalIntakeStatus;
  consumedAt: Date;
  confirmedAt: Date | null;
  discardedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdditionalIntakeCreationAttributes
  extends Optional<
    AdditionalIntakeAttributes,
    | "id"
    | "imageUrl"
    | "status"
    | "consumedAt"
    | "confirmedAt"
    | "discardedAt"
    | "createdAt"
    | "updatedAt"
  > {}

export class AdditionalIntake
  extends Model<
    AdditionalIntakeAttributes,
    AdditionalIntakeCreationAttributes
  >
  implements AdditionalIntakeAttributes
{
  public id!: string;
  public userId!: string;
  public description!: string;
  public calories!: number;
  public protein!: number;
  public carbs!: number;
  public fat!: number;
  public imageUrl!: string | null;
  public status!: AdditionalIntakeStatus;
  public consumedAt!: Date;
  public confirmedAt!: Date | null;
  public discardedAt!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdditionalIntake.init(
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

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    calories: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    protein: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    carbs: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    fat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image_url",
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "discarded"
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    consumedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "consumed_at",
    },

    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "confirmed_at",
    },

    discardedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "discarded_at",
    },
  },
  {
    sequelize,
    tableName: "additional_intakes",
    modelName: "AdditionalIntake",
    timestamps: true,
  }
);

export default AdditionalIntake;