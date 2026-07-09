import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface FoodAttributes {
  id: number;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portionGrams: number;
  imageUrl?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type FoodCreationAttributes = Optional<
  FoodAttributes,
  'id' | 'protein' | 'carbs' | 'fat' | 'portionGrams' | 'imageUrl' | 'description' | 'createdAt' | 'updatedAt'
>;

class Food
  extends Model<FoodAttributes, FoodCreationAttributes>
  implements FoodAttributes {
  public id!: number;
  public name!: string;
  public category!: string;
  public calories!: number;
  public protein!: number;
  public carbs!: number;
  public fat!: number;
  public portionGrams!: number;
  public imageUrl?: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Food.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    calories: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    protein: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    carbs: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    fat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    portionGrams: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 100,
      field: 'portion_grams',
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'image_url',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'foods',
    timestamps: true,
  }
);

export default Food;
