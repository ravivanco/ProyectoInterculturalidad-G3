import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ExerciseTrackingAttributes {
  id: string;
  userId: string;
  planExerciseId: string;
  completed: boolean;
  durationMinutes: number | null;
  caloriesBurned: number | null;
  notes: string | null;
  completedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExerciseTrackingCreationAttributes
  extends Optional<
    ExerciseTrackingAttributes,
    | "id"
    | "completed"
    | "durationMinutes"
    | "caloriesBurned"
    | "notes"
    | "completedAt"
    | "createdAt"
    | "updatedAt"
  > {}

export class ExerciseTracking
  extends Model<
    ExerciseTrackingAttributes,
    ExerciseTrackingCreationAttributes
  >
  implements ExerciseTrackingAttributes
{
  public id!: string;
  public userId!: string;
  public planExerciseId!: string;
  public completed!: boolean;
  public durationMinutes!: number | null;
  public caloriesBurned!: number | null;
  public notes!: string | null;
  public completedAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExerciseTracking.init(
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

    planExerciseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "plan_exercise_id",
    },

    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "duration_minutes",
      validate: {
        min: 0,
      },
    },

    caloriesBurned: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "calories_burned",
      validate: {
        min: 0,
      },
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "completed_at",
    },
  },
  {
    sequelize,
    tableName: "exercise_tracking",
    modelName: "ExerciseTracking",
    timestamps: true,
  }
);

export default ExerciseTracking;