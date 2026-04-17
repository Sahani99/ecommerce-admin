
// // src/admin/options.js
// import { ComponentLoader } from 'adminjs'
// import { User, Product, Category, Order, OrderItem, Setting } from '../models/index.js'
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const componentLoader = new ComponentLoader()

// // Absolute paths are safer for Linux (Render)
// const Dashboard = componentLoader.add('Dashboard', path.resolve(__dirname, './components/Dashboard.jsx'))
// const SettingsList = componentLoader.add('SettingsList', path.resolve(__dirname, './components/SettingsList.jsx'))

// export const adminOptions = {
//   rootPath: '/admin',
//   branding: {
//     companyName: 'E-Shop Admin',
//     withMadeWithLove: false,
//   },
//   resources: [
//     {
//       resource: User,
//       options: {
//         navigation: { name: 'Users', icon: 'User' },
//         properties: { password: { isVisible: false } },
//         actions: {
//           list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
//           new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
//           edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
//           delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
//         }
//       }
//     },
//     {
//       resource: Setting,
//       options: {
//         navigation: { name: 'System', icon: 'Settings' },
//         actions: {
//           list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
//         },
//         components: { list: SettingsList }
//       }
//     },
//     { resource: Category, options: { navigation: { name: 'Shop', icon: 'Folder' } } },
//     { resource: Product, options: { navigation: { name: 'Shop', icon: 'Package' } } },
//     { resource: Order, options: { navigation: { name: 'Sales', icon: 'ShoppingBag' } } },
//     { resource: OrderItem, options: { navigation: { name: 'Sales', icon: 'List' } } }
//   ],
//   componentLoader,
//   dashboard: {
//     component: Dashboard,
//     // CRITICAL: Assignment Requirement - Handler for summary info
//     handler: async (request, response, context) => {
//       const { currentAdmin } = context;
//       const isAdmin = currentAdmin?.role === 'admin';

//       if (!isAdmin) return { isAdmin: false };

//       const [userCount, orderCount, productCount, revenue] = await Promise.all([
//         User.count().catch(() => 0),
//         Order.count().catch(() => 0),
//         Product.count().catch(() => 0),
//         Order.sum('totalAmount').catch(() => 0)
//       ]);

//       return {
//         userCount,
//         orderCount,
//         productCount,
//         revenue: revenue || 0,
//         isAdmin: true
//       };
//     }
//   }
// }

import { ComponentLoader } from 'adminjs'
import { User, Product, Category, Order, OrderItem, Setting } from '../models/index.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const componentLoader = new ComponentLoader()

// Use absolute paths with validation for cross-platform compatibility
const dashboardPath = path.resolve(__dirname, 'components', 'Dashboard.jsx')
const settingsPath = path.resolve(__dirname, 'components', 'SettingsList.jsx')

console.log('📂 Component paths:');
console.log('  Dashboard:', dashboardPath, '- exists:', fs.existsSync(dashboardPath));
console.log('  Settings:', settingsPath, '- exists:', fs.existsSync(settingsPath));

const Dashboard = componentLoader.add('Dashboard', dashboardPath)
const SettingsList = componentLoader.add('SettingsList', settingsPath)

export const adminOptions = {
  rootPath: '/admin',
  branding: {
    companyName: 'E-Shop Admin',
    withMadeWithLove: false,
  },
  resources: [
    {
      resource: User,
      options: {
        navigation: { name: 'Users', icon: 'User' },
        // Requirement 3: Ensure Email is the "Title" so it shows up in Order lookups
        properties: { 
          email: { isTitle: true },
          password: { isVisible: false } 
        },
        actions: {
          // Requirement 5: RBAC - Hide from regular users
          list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
        }
      }
    },
    {
      resource: Setting,
      options: {
        navigation: { name: 'System', icon: 'Settings' },
        actions: {
          list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
        },
        components: { list: SettingsList }
      }
    },
    { 
      resource: Category, 
      options: { 
        navigation: { name: 'Shop', icon: 'Folder' },
        properties: { name: { isTitle: true } }
      } 
    },
    { 
      resource: Product, 
      options: { 
        navigation: { name: 'Shop', icon: 'Package' },
        properties: {
          name: { isTitle: true }, // Shows Product Name in Order Items
          description: { type: 'richtext' },
          price: { type: 'currency', props: { symbol: '$' } }
        }
      } 
    },
    { 
      resource: Order, 
      options: { 
        navigation: { name: 'Sales', icon: 'ShoppingBag' },
        properties: {
          totalAmount: { type: 'currency', props: { symbol: '$' } }
        }
      } 
    },
    { 
      resource: OrderItem, 
      options: { navigation: { name: 'Sales', icon: 'List' } } 
    }
  ],
  componentLoader,
  dashboard: {
    component: Dashboard,
    handler: async (request, response, context) => {
      const { currentAdmin } = context;
      
      // FIX 2: Added more safety checks for RBAC
      const role = currentAdmin?.role?.toLowerCase();
      const isAdmin = role === 'admin';

      if (!isAdmin) {
        return { isAdmin: false, userEmail: currentAdmin?.email };
      }

      try {
        // Requirement 5: Dashboard summary information
        const [userCount, orderCount, productCount, revenue] = await Promise.all([
          User.count().catch(() => 0),
          Order.count().catch(() => 0),
          Product.count().catch(() => 0),
          Order.sum('totalAmount').catch(() => 0)
        ]);

        return {
          userCount,
          orderCount,
          productCount,
          revenue: revenue || 0,
          isAdmin: true
        };
      } catch (error) {
        console.error('Dashboard Handler Error:', error);
        return { isAdmin: true, error: 'Stats unavailable' };
      }
    }
  }
}