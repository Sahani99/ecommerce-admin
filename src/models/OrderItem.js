import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OrderItem = sequelize.define("OrderItem", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Price at the time of purchase
    allowNull: false,
  }
},
{
  tableName: "OrderItems",
});

export default OrderItem;