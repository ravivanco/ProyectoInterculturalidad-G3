import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type ExerciseDifficulty =
  | 'principiante'
  | 'intermedio'
  | 'avanzado';

export interface ExerciseAttributes {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: ExerciseDifficulty;
  muscleGroup: string;
  caloriesPerMinute: number;
  imageUrl?: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExerciseCreationAttributes
  extends Optional<
    ExerciseAttributes,
    'id' | 'imageUrl' | 'active' | 'createdAt' | 'updatedAt'
  > {}

export class Exercise
  extends Model<ExerciseAttributes, ExerciseCreationAttributes>
  implements ExerciseAttributes
{
  public id!: string;
  public name!: string;
  public description!: string;
  public category!: string;
  public difficulty!: ExerciseDifficulty;
  public muscleGroup!: string;
  public caloriesPerMinute!: number;
  public imageUrl!: string | null;
  public active!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Exercise.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },

    difficulty: {
      type: DataTypes.ENUM(
        'principiante',
        'intermedio',
        'avanzado'
      ),
      allowNull: false,
    },

    muscleGroup: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'muscle_group',
    },

    caloriesPerMinute: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'calories_per_minute',
      validate: {
        min: 0,
      },
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url',
    },

    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'exercises',
    modelName: 'Exercise',
    timestamps: true,
  }
);

export default Exercise;