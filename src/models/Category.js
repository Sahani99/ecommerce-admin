import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true, // Prevents saving empty strings
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

export default Category;