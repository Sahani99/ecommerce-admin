// import 'dotenv/config';
// import express from 'express';
// import session from 'express-session';
// import AdminJS from 'adminjs';
// import AdminJSExpress from '@adminjs/express';
// import * as AdminJSSequelize from '@adminjs/sequelize';
// import { sequelize, User } from './models/index.js';
// import { adminOptions } from './admin/options.js';
// import authRoutes from './routes/auth.js';

// AdminJS.registerAdapter(AdminJSSequelize);

// const start = async () => {
//   const app = express();
//   app.use(express.json());

//   try {
//     // 1. Connect and Sync Database FIRST
//     await sequelize.authenticate();
//     await sequelize.sync(); 
//     console.log('✅ Database connected and synced.');

//     // 2. Initialize AdminJS
//     const admin = new AdminJS(adminOptions);

//     // 3. Generate Bundle for Production (Fixes the "Default Dashboard" issue)
//     if (process.env.NODE_ENV === 'production') {
//       console.log('Building production bundle...');
//       await admin.initialize(); 
//     }

//     // 4. API Routes
//     app.use('/api', authRoutes);

//     // 5. Auth Router
//     const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
//       authenticate: async (email, password) => {
//         const user = await User.findOne({ where: { email } });
//         if (user && await user.validPassword(password)) {
//           return { email: user.email, role: user.role, id: user.id };
//         }
//         return null;
//       },
//       cookieName: 'adminjs-session',
//       cookiePassword: process.env.SESSION_SECRET || 'a-very-secret-password-12345678',
//     }, null, {
//       resave: false,
//       saveUninitialized: true,
//       secret: process.env.SESSION_SECRET || 'a-very-secret-password-12345678',
//       cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' }
//     });

//     app.use(admin.options.rootPath, adminRouter);

//     const PORT = process.env.PORT || 5001;
//     app.listen(PORT, '0.0.0.0', () => {
//       console.log(`🚀 Admin Panel: http://0.0.0.0:${PORT}/admin`);
//     });

//   } catch (error) {
//     console.error('❌ Failed to start server:', error);
//     process.exit(1);
//   }
// };

// start();
import 'dotenv/config';
import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import path from 'path';
import { sequelize, User } from './models/index.js';
import { adminOptions } from './admin/options.js';
import authRoutes from './routes/auth.js';

AdminJS.registerAdapter(AdminJSSequelize);

const start = async () => {
  const app = express();
  app.use(express.json());

  // 1. Serve static assets FROM the .adminjs folder
  // This fixes the 404 / MIME type error
  app.use('/admin/frontend/assets', express.static(path.join(process.cwd(), '.adminjs')));

  try {
    await sequelize.authenticate();
    console.log('✅ DB Connected');

    const admin = new AdminJS(adminOptions);

    // 2. IMPORTANT: Do NOT call admin.initialize() or admin.watch() here on Render.
    // The build script handled it. Just mount the router.

    app.use('/api', authRoutes);

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
      authenticate: async (email, password) => {
        const user = await User.findOne({ where: { email } });
        if (user && await user.validPassword(password)) {
          return { email: user.email, role: user.role, id: user.id };
        }
        return null;
      },
      cookieName: 'adminjs-session',
      cookiePassword: process.env.SESSION_SECRET || 'a-very-long-secret-key-32-chars-long',
    }, null, {
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET || 'a-very-long-secret-key-32-chars-long',
      cookie: { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }
    });

    app.use(admin.options.rootPath, adminRouter);

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Admin Panel ready at https://ecommerce-admin-x4j1.onrender.com/admin`);
    });

  } catch (error) {
    console.error('❌ Startup Error:', error);
    process.exit(1);
  }
};

start();