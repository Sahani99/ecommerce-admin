// import 'dotenv/config';
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import jwt from 'jsonwebtoken';
// import session from 'express-session';
// import AdminJS from 'adminjs';
// import AdminJSExpress from '@adminjs/express';
// import * as AdminJSSequelize from '@adminjs/sequelize';
// import path from 'path';

// // Ensure these paths match your folder structure exactly
// import { sequelize, User } from './models/index.js';
// import { adminOptions } from './admin/options.js';
// import authRoutes from './routes/auth.js';
// import dashboardRoutes from './routes/dashboard.js';

// AdminJS.registerAdapter(AdminJSSequelize);

// const start = async () => {

//   // app.use('/admin/frontend/assets', express.static(path.join(__dirname, '../.adminjs')));
//   app.use('/admin/frontend/assets', express.static(path.join(process.cwd(), '.adminjs')));


//   const app = express();
//   app.use(express.json());
//   app.use(cookieParser());

//   // Initialize AdminJS first
// //   const admin = new AdminJS(adminOptions);
// //   if (process.env.NODE_ENV !== 'production') {
// //   await admin.watch()
// // }

// const admin = new AdminJS(adminOptions);

// if (process.env.NODE_ENV === 'production') {
//   await admin.initialize();
// } else {
//   await admin.watch();
// }

//   // Requirement: Implement /api/login endpoint
//   app.use('/api', authRoutes);
//   app.use('/api/dashboard', dashboardRoutes);

//   // Requirement: Secure AdminJS with Authentication
//   // Use the 'admin' instance created above
//   const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
//     authenticate: async (email, password, context) => {
//       try {
//         const user = await User.findOne({ where: { email } });
//         if (user && await user.validPassword(password)) {
//           const token = jwt.sign(
//             { id: user.id, email: user.email, role: user.role },
//             process.env.JWT_SECRET || 'fallback_jwt_secret',
//             { expiresIn: '1h' }
//           );

//           if (context?.res?.cookie) {
//             context.res.cookie('admin_jwt', token, {
//               httpOnly: true,
//               secure: process.env.NODE_ENV === 'production',
//               sameSite: 'lax',
//               maxAge: 60 * 60 * 1000,
//             });
//           }
//           return {
//             email: user.email,
//             role: user.role, // Must be exactly 'admin' or 'user'
//             id: user.id
//           };
//         }
//       } catch (err) {
//         console.error('Auth error:', err);
//       }
//       return null;
//     },
//     cookieName: 'adminjs-session',
//     cookiePassword: process.env.SESSION_SECRET || 'a-very-secret-password-12345678',
//   }, null, {
//     resave: false,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET || 'a-very-secret-password-12345678',
//     cookie: {
//       httpOnly: true,
//       secure: false, // Set to true if using HTTPS
//     }
//   });

//   // Mount AdminJS with a JWT verification layer before the router
//   app.use(admin.options.rootPath, (req, res, next) => {
//     const token = req.cookies?.admin_jwt || (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);
//     if (!token) {
//       return next();
//     }
//     try {
//       req.adminJwt = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
//     } catch (err) {
//       res.clearCookie('admin_jwt');
//     }
//     return next();
//   }, adminRouter);

//   try {
//     await sequelize.authenticate();
//     console.log('✅ Database connected.');
//     console.log("User model table:", User.getTableName());
    
//     // Sync models (creates tables if they don't exist)
//     await sequelize.sync(); 

//     const PORT = process.env.PORT || 5001;
//     app.listen(PORT, () => {
//       console.log(`🚀 Admin Panel: http://localhost:${PORT}${admin.options.rootPath}`);
//       console.log(`🔑 Login API: http://localhost:${PORT}/api/login`);
//     });
//   } catch (error) {
//     console.error('❌ Unable to connect to database:', error);
//   }
// };

// start();

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import path from 'path';

// Ensure these paths match your folder structure exactly
import { sequelize, User } from './models/index.js';
import { adminOptions } from './admin/options.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

AdminJS.registerAdapter(AdminJSSequelize);

const start = async () => {
  // --- STEP 1: INITIALIZE EXPRESS FIRST ---
  const app = express();
  
  // --- STEP 2: MOUNT STATIC ASSETS FOR THE BUNDLE ---
  // This must happen AFTER app is defined
  app.use('/admin/frontend/assets', express.static(path.join(process.cwd(), '.adminjs')));

  app.use(express.json());
  app.use(cookieParser());

  // --- STEP 3: INITIALIZE ADMINJS ---
  const admin = new AdminJS(adminOptions);

  if (process.env.NODE_ENV === 'production') {
    await admin.initialize();
  } else {
    await admin.watch();
  }

  // Routes
  app.use('/api', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Secure AdminJS with Authentication
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password, context) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (user && await user.validPassword(password)) {
          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_jwt_secret',
            { expiresIn: '1h' }
          );

          if (context?.res?.cookie) {
            context.res.cookie('admin_jwt', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 1000,
            });
          }
          return {
            email: user.email,
            role: user.role,
            id: user.id
          };
        }
      } catch (err) {
        console.error('Auth error:', err);
      }
      return null;
    },
    cookieName: 'adminjs-session',
    cookiePassword: process.env.SESSION_SECRET || 'a-very-secret-password-12345678',
  }, null, {
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'a-very-secret-password-12345678',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }
  });

  // Mount AdminJS Router
  app.use(admin.options.rootPath, (req, res, next) => {
    const token = req.cookies?.admin_jwt || (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);
    if (!token) {
      return next();
    }
    try {
      req.adminJwt = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
    } catch (err) {
      res.clearCookie('admin_jwt');
    }
    return next();
  }, adminRouter);

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');
    
    await sequelize.sync(); 

    const PORT = process.env.PORT || 5001;
    // On Render, we must listen on 0.0.0.0
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Admin Panel: http://localhost:${PORT}${admin.options.rootPath}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }
};

start();