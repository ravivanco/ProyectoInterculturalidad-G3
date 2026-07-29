// PG3-342 — Tracking de ejercicios (API-S4, Bryan Gualpa)
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ExerciseLogAttributes {
  id: string;
  patientId: string;
  exerciseName: string;
  durationMinutes: number;
  completedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type ExerciseLogCreation = Optional<ExerciseLogAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class ExerciseLog
  extends Model<ExerciseLogAttributes, ExerciseLogCreation>
  implements ExerciseLogAttributes {
  public id!: string;
  public patientId!: string;
  public exerciseName!: string;
  public durationMinutes!: number;
  public completedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExerciseLog.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patientId: { type: DataTypes.UUID, allowNull: false, field: 'patient_id' },
    exerciseName: { type: DataTypes.STRING(255), allowNull: false, field: 'exercise_name' },
    durationMinutes: { type: DataTypes.INTEGER, allowNull: false, field: 'duration_minutes' },
    completedAt: { type: DataTypes.DATE, allowNull: false, field: 'completed_at' },
  },
  { sequelize, tableName: 'exercise_logs', timestamps: true }
);

export default ExerciseLog;
