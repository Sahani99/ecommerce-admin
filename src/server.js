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

  try {
    // 1. Database Connection & Sync
    await sequelize.authenticate();
    await sequelize.sync(); 
    console.log('✅ DB Connected');

    // 2. Initialize AdminJS Instance
    const admin = new AdminJS(adminOptions);

    // 4. API Login Route
    app.use('/api', authRoutes);

    // 3. BUILD BUNDLE (Crucial for Render and custom components)
    // Must be done BEFORE buildAuthenticatedRouter
    console.log('🔨 Initializing AdminJS with custom components...');
    try {
      await admin.initialize();
      console.log('✅ AdminJS bundle created successfully');
    } catch (bundleError) {
      console.warn('⚠️ Bundle initialization warning:', bundleError.message);
    }

    // 5. AdminJS Authenticated Router
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

    // 6. Mount the Admin Router
    // The adminRouter from buildAuthenticatedRouter handles all assets internally
    app.use(admin.options.rootPath, adminRouter);

    // 7. CRITICAL: Fallback static route for components.bundle.js
    // This ensures the custom components bundle is always served with correct MIME type
    const fs = await import('fs');
    const adminAssetsPath = path.join(process.cwd(), '.adminjs');
    if (fs.default.existsSync(adminAssetsPath)) {
      app.use('/admin/frontend/assets', express.static(adminAssetsPath, { 
        maxAge: 0, // No caching to avoid stale bundles
        setHeaders: (res, filePath) => {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
          if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          }
          if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
          }
        }
      }));
      console.log(`✅ Static assets mounted from ${adminAssetsPath}`);
    } else {
      console.warn(`⚠️ AdminJS assets directory not found at ${adminAssetsPath}`);
    }

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Admin Panel ready at http://0.0.0.0:${PORT}/admin`);
    });

  } catch (error) {
    console.error('❌ Startup Error:', error);
    process.exit(1);
  }
};

start();