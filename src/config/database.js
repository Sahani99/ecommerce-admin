import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});
console.log('Connecting to database:', process.env.DATABASE_URL);
export default sequelize;