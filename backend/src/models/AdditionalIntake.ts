import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class AdditionalIntake extends Model {}

AdditionalIntake.init(
{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },

    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },

    calories:{
        type:DataTypes.FLOAT,
        allowNull:false
    },

    protein:{
        type:DataTypes.FLOAT,
        defaultValue:0
    },

    carbs:{
        type:DataTypes.FLOAT,
        defaultValue:0
    },

    fat:{
        type:DataTypes.FLOAT,
        defaultValue:0
    },

    imageUrl:{
        type:DataTypes.STRING,
        allowNull:true
    },

    status:{
        type:DataTypes.ENUM(
            "pending",
            "confirmed",
            "discarded"
        ),
        defaultValue:"pending"
    }

},
{
    sequelize,
    modelName:"AdditionalIntake",
    tableName:"additional_intakes",
    timestamps:true
}
);

export default AdditionalIntake;