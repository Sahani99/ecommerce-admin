// // admin/options.js
// import { ComponentLoader } from 'adminjs'
// import { User, Product, Category, Order, OrderItem, Setting } from '../models/index.js'
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const componentLoader = new ComponentLoader()

// const Dashboard = componentLoader.add('Dashboard', path.resolve(__dirname, './components/Dashboard.jsx'))
// const SettingsList = componentLoader.add('SettingsList', path.resolve(__dirname, './components/SettingsList.jsx'))

// export const adminOptions = {
//   rootPath: '/admin',
//   branding: {
//     companyName: 'E-Shop Admin',
//     withMadeWithLove: false,
//   },
//   resources: [
//     // --- USER MANAGEMENT GROUP ---
//     {
//       resource: User,
//       options: {
//         navigation: { name: 'Users', icon: 'User' },
//         properties: { 
//           password: { isVisible: false },
//           role: { availableValues: [ { value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' } ] }
//         },
//         actions: {
//           list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
//         }
//       }
//     },
//     // --- SHOP GROUP ---
//     {
//       resource: Product,
//       options: {
//         navigation: { name: 'Shop', icon: 'Package' },
//         properties: {
//           description: { type: 'richtext' },
//           price: { type: 'currency', props: { symbol: '$' } }
//         }
//       }
//     },
//     {
//       resource: Category,
//       options: { navigation: { name: 'Shop', icon: 'Folder' } }
//     },
//     // --- SALES GROUP ---
//     {
//       resource: Order,
//       options: {
//         navigation: { name: 'Sales', icon: 'ShoppingBag' },
//         properties: {
//           userId: { isTitle: false }, // Use the reference instead
//           totalAmount: { type: 'currency', props: { symbol: '$' } }
//         }
//       }
//     },
//     {
//       resource: OrderItem,
//       options: {
//         navigation: { name: 'Sales', icon: 'List' },
//       }
//     },
//     // --- SYSTEM GROUP ---
//     {
//       resource: Setting,
//       options: {
//         navigation: { name: 'System', icon: 'Settings' },
//         actions: {
//           list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
//         },
//         components: { list: SettingsList }
//       }
//     }
//   ],
//   componentLoader,
//   dashboard: {
//     component: Dashboard
//   }
// }

// src/admin/options.js
import { ComponentLoader } from 'adminjs'
import { User, Product, Category, Order, OrderItem, Setting } from '../models/index.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const componentLoader = new ComponentLoader()

// Absolute paths are safer for Linux (Render)
const Dashboard = componentLoader.add('Dashboard', path.resolve(__dirname, './components/Dashboard.jsx'))
const SettingsList = componentLoader.add('SettingsList', path.resolve(__dirname, './components/SettingsList.jsx'))

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
        properties: { password: { isVisible: false } },
        actions: {
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
    { resource: Category, options: { navigation: { name: 'Shop', icon: 'Folder' } } },
    { resource: Product, options: { navigation: { name: 'Shop', icon: 'Package' } } },
    { resource: Order, options: { navigation: { name: 'Sales', icon: 'ShoppingBag' } } },
    { resource: OrderItem, options: { navigation: { name: 'Sales', icon: 'List' } } }
  ],
  componentLoader,
  dashboard: {
    component: Dashboard,
    // CRITICAL: Assignment Requirement - Handler for summary info
    handler: async (request, response, context) => {
      const { currentAdmin } = context;
      const isAdmin = currentAdmin?.role === 'admin';

      if (!isAdmin) return { isAdmin: false };

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
    }
  }
}