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
  resources: [
    {
      resource: User,
      options: {
        isVisible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin',
        properties: { password: { isVisible: false } },
        actions: {
          list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          show: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
        }
      }
    },
    {
      resource: Setting,
      options: {
        isVisible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin',
        actions: {
          list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          show: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
        }
      },
      components: {
        list: SettingsList
      }
    },
    {
      resource: Category,
      options: {
        actions: {
          list: { isAccessible: () => true },
          show: { isAccessible: () => true },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
        }
      }
    },
    {
      resource: Product,
      options: {
        actions: {
          list: { isAccessible: () => true },
          show: { isAccessible: () => true },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
        }
      }
    },
    {
      resource: Order,
      options: {
        actions: {
          list: { isAccessible: () => true },
          show: { isAccessible: () => true },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
        }
      }
    },
    {
      resource: OrderItem,
      options: {
        actions: {
          list: { isAccessible: () => true },
          show: { isAccessible: () => true },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' },
          bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role?.toLowerCase() === 'admin' }
        }
      }
    }
  ],
  componentLoader,
//   dashboard: {
//     isAccessible: ({ currentAdmin }) => !!currentAdmin,
//     handler: async (request, response, context) => {
//       const currentAdmin = context?.currentAdmin || request?.session?.passport?.user;
//       const role = currentAdmin?.role?.toLowerCase() || '';
//       const isAdmin = role === 'admin';

  

//       const stats = {
//         userCount: 0,
//         orderCount: 0,
//         productCount: 0,
//         revenue: 0,
//         isAdmin
//       }


//       if (isAdmin) {
//         // try {
//         //   stats.userCount = await User.count()
//         //   stats.orderCount = await Order.count()
//         //   stats.productCount = await Product.count()
//         //   stats.revenue = (await Order.sum('totalAmount')) || 0
//         // } catch (error) {
//         //   console.error('[Dashboard handler] count error:', error)
//         // }
//           try {
//     const userCount = await User.count();
//     const orderCount = await Order.count();
//     const productCount = await Product.count();
//     const revenue = await Order.sum('totalAmount') || 0;

//     console.log("userCount:", userCount);
//     console.log("orderCount:", orderCount);
//     console.log("productCount:", productCount);
//     console.log("revenue:", revenue);

//     stats.userCount = userCount;
//     stats.orderCount = orderCount;
//     stats.productCount = productCount;
//     stats.revenue = revenue;

//   } catch (error) {
//     console.error('[Dashboard handler] count error:', error);
//   }
//       }

//       return stats
//     },
//     component: Dashboard
//   }
// }

// admin/options.js

 dashboard: {
    // Ensure the dashboard is accessible to any logged-in user
    isAccessible: ({ currentAdmin }) => !!currentAdmin,
    handler: async (request, response, context) => {
      const { currentAdmin } = context;

      // --- LOUD LOGGING ---
      console.log('---------------------------------------');
      console.log('DASHBOARD REQUEST RECEIVED');
      console.log('USER EMAIL:', currentAdmin?.email);
      console.log('USER ROLE:', currentAdmin?.role);
      // --------------------

      const role = currentAdmin?.role?.toLowerCase() || '';
      const isAdmin = role === 'admin';

      if (!isAdmin) {
        console.log('RESULT: User is NOT admin. Returning zeros.');
        return {
          userCount: 0,
          orderCount: 0,
          productCount: 0,
          revenue: 0,
          isAdmin: false
        };
      }

      try {
        console.log('RESULT: User IS admin. Fetching data from DB...');
        
        const [uCount, oCount, pCount, revSum] = await Promise.all([
          User.count(),
          Order.count(),
          Product.count(),
          Order.sum('totalAmount')
        ]);

        const stats = {
          userCount: uCount || 0,
          orderCount: oCount || 0,
          productCount: pCount || 0,
          revenue: revSum || 0,
          isAdmin: true
        };

        console.log('SUCCESS: Data fetched:', stats);
        console.log('---------------------------------------');
        
        return stats;
      } catch (error) {
        console.error('DATABASE ERROR:', error);
        return { error: 'Failed to fetch data', isAdmin: true };
      }
    },
    component: Dashboard
  }
}