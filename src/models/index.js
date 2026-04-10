import sequelize from "../config/database.js";
import User from "./User.js";
import Category from "./Category.js";
import Product from "./Product.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import Setting from "./Setting.js";

// --- ASSOCIATIONS ---

// A Category has many Products
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
// A Product belongs to a Category
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// A User has many Orders
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// An Order has many OrderItems
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: 'CASCADE', as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// A Product can be in many OrderItems
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

export {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Setting
};