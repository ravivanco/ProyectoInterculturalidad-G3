import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface PlanExerciseAttributes {
  id: string;
  weekId: string;
  day: number;
  exerciseId: string;
  sets: number | null;
  repetitions: number | null;
  durationMinutes: number | null;
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PlanExerciseCreationAttributes
  extends Optional<
    PlanExerciseAttributes,
    | "id"
    | "sets"
    | "repetitions"
    | "durationMinutes"
    | "notes"
    | "createdAt"
    | "updatedAt"
  > {}

export class PlanExercise
  extends Model<
    PlanExerciseAttributes,
    PlanExerciseCreationAttributes
  >
  implements PlanExerciseAttributes
{
  public id!: string;
  public weekId!: string;
  public day!: number;
  public exerciseId!: string;
  public sets!: number | null;
  public repetitions!: number | null;
  public durationMinutes!: number | null;
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlanExercise.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    weekId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "week_id",
    },

    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 7,
      },
    },

    exerciseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "exercise_id",
    },

    sets: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },

    repetitions: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },

    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "duration_minutes",
      validate: {
        min: 1,
      },
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "plan_exercises",
    modelName: "PlanExercise",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["week_id", "day", "exercise_id"],
      },
    ],
  }
);

export default PlanExercise;