import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // 10 digits total, 2 after the decimal point
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0, // Price cannot be negative
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0, // Stock cannot be negative
    },
  },
  sku: {
    type: DataTypes.STRING,
    unique: true, // Stock Keeping Unit (Unique identifier for inventory)
  },
}, {
  timestamps: true,
});

export default Product;