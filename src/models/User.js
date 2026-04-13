import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

// const User = sequelize.define("User", {
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: { isEmail: true }
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   role: {
//     type: DataTypes.ENUM("admin", "user"),
//     defaultValue: "user",
//   },
// }, {
//   hooks: {
//     // Automatically hash password before saving to DB
//     beforeCreate: async (user) => {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(user.password, salt);
//     },
//     beforeUpdate: async (user) => {
//       if (user.changed('password')) {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password, salt);
//       }
//     }
//   }
// },
// {
//   tableName: "Users",});


const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "user",
  },
}, {
  tableName: "Users",
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to check password during login
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default User;