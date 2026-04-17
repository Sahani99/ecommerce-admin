// import dotenv from 'dotenv';
// import { Sequelize } from 'sequelize';
// dotenv.config();

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   logging: false,
//     dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false, // Required for Render/Supabase/Neon
//     },
//   },
// });
// console.log('Connecting to database:', process.env.DATABASE_URL);
// export default sequelize;

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/db';

// This helps us debug on Render without showing the password
if (databaseUrl) {
  const host = databaseUrl.split('@')[1] || 'unknown host';
  console.log('📡 Attempting connection to host:', host.split('/')[0]);
} else {
  console.log('❌ DATABASE_URL is missing from environment!');
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
  // Prevent build hang
  retry: { max: 0 } 
});

export default sequelize;