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
//   resources: [
//     {
//       resource: User,
//       options: {
//         isVisible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin',
//         properties: { password: { isVisible: false } },
//         actions: {
//           list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           show: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
//         }
//       }
//     },
//     {
//       resource: Setting,
//       options: {
//         isVisible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin',
//         actions: {
//           list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           show: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
//         }
//       },
//       components: {
//         list: SettingsList
//       }
//     },
//     {
//       resource: Category,
//       options: {
//         actions: {
//           list: { isAccessible: () => true },
//           show: { isAccessible: () => true },
//           edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
//         }
//       }
//     },
//     {
//       resource: Product,
//       options: {
//         actions: {
//           list: { isAccessible: () => true },
//           show: { isAccessible: () => true },
//           edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
//         }
//       }
//     },
//     {
//       resource: Order,
//       options: {
//         actions: {
//           list: { isAccessible: () => true },
//           show: { isAccessible: () => true },
//           edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
//         }
//       }
//     },
//     {
//       resource: OrderItem,
//       options: {
//         actions: {
//           list: { isAccessible: () => true },
//           show: { isAccessible: () => true },
//           edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
//           bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
//         }
//       }
//     }
//   ],
//   componentLoader,
//  dashboard: {
//     // Ensure the dashboard is accessible to any logged-in user
//     isAccessible: ({ currentAdmin }) => !!currentAdmin,
//     handler: async (request, response, context) => {
//       const { currentAdmin } = context;

//       // --- LOUD LOGGING ---
//       console.log('---------------------------------------');
//       console.log('DASHBOARD REQUEST RECEIVED');
//       console.log('USER EMAIL:', currentAdmin?.email);
//       console.log('USER ROLE:', currentAdmin?.role);
//       // --------------------

//       const role = currentAdmin?.role?.toLowerCase() || '';
//       const isAdmin = role === 'admin';

//       if (!isAdmin) {
//         console.log('RESULT: User is NOT admin. Returning zeros.');
//         return {
//           userCount: 0,
//           orderCount: 0,
//           productCount: 0,
//           revenue: 0,
//           isAdmin: false
//         };
//       }

//       try {
//         console.log('RESULT: User IS admin. Fetching data from DB...');
        
//         const [uCount, oCount, pCount, revSum] = await Promise.all([
//           User.count(),
//           Order.count(),
//           Product.count(),
//           Order.sum('totalAmount')
//         ]);

//         const stats = {
//           userCount: uCount || 0,
//           orderCount: oCount || 0,
//           productCount: pCount || 0,
//           revenue: revSum || 0,
//           isAdmin: true
//         };

//         console.log('SUCCESS: Data fetched:', stats);
//         console.log('---------------------------------------');
        
//         return stats;
//       } catch (error) {
//         console.error('DATABASE ERROR:', error);
//         return { error: 'Failed to fetch data', isAdmin: true };
//       }
//     },
//     component: Dashboard
//   }
// }

// admin/options.js - FINAL VERSION
import { ComponentLoader } from 'adminjs'
import { User, Product, Category, Order, OrderItem, Setting } from '../models/index.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const componentLoader = new ComponentLoader()

const Dashboard = componentLoader.add('Dashboard', path.resolve(__dirname, './components/Dashboard.jsx'))
const SettingsList = componentLoader.add('SettingsList', path.resolve(__dirname, './components/SettingsList.jsx'))

export const adminOptions = {
  rootPath: '/admin',
  branding: {
    companyName: 'E-Shop Admin',
    withMadeWithLove: false,
  },
  resources: [
    // --- USER MANAGEMENT GROUP ---
    {
      resource: User,
      options: {
        navigation: { name: 'Users', icon: 'User' },
        properties: { 
          password: { isVisible: false },
          role: { availableValues: [ { value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' } ] }
        },
        actions: {
          list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
        }
      }
    },
    // --- SHOP GROUP ---
    {
      resource: Product,
      options: {
        navigation: { name: 'Shop', icon: 'Package' },
        properties: {
          description: { type: 'richtext' },
          price: { type: 'currency', props: { symbol: '$' } }
        }
      }
    },
    {
      resource: Category,
      options: { navigation: { name: 'Shop', icon: 'Folder' } }
    },
    // --- SALES GROUP ---
    {
      resource: Order,
      options: {
        navigation: { name: 'Sales', icon: 'ShoppingBag' },
        properties: {
          userId: { isTitle: false }, // Use the reference instead
          totalAmount: { type: 'currency', props: { symbol: '$' } }
        }
      }
    },
    {
      resource: OrderItem,
      options: {
        navigation: { name: 'Sales', icon: 'List' },
      }
    },
    // --- SYSTEM GROUP ---
    {
      resource: Setting,
      options: {
        navigation: { name: 'System', icon: 'Settings' },
        actions: {
          list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
        },
        components: { list: SettingsList }
      }
    }
  ],
  componentLoader,
  dashboard: {
    component: Dashboard
  }
}