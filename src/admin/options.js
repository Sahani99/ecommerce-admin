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
  componentLoader,
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
  
  // dashboard: {
  //   handler: async (request, response, context) => {
  //     console.log("DASHBOARD HIT");
  //     const { currentAdmin } = context;
  //     const role = currentAdmin?.role || '';
  //     const isAdmin = role === 'admin';

  //     if (!isAdmin) {
  //       return {
  //         userCount: 0,
  //         orderCount: 0,
  //         productCount: 0,
  //         revenue: 0,
  //         isAdmin: false
  //       };
  //     }

  //     try {
  //       const userCount = await User.count();
  //       console.log("Users:", userCount);
  //       const orderCount = await Order.count();
  //       const productCount = await Product.count();
  //       const revenue = await Order.sum('totalAmount');

  //       return {
  //         userCount: userCount || 0,
  //         orderCount: orderCount || 0,
  //         productCount: productCount || 0,
  //         revenue: revenue || 0,
  //         isAdmin: true
  //       };
  //     } catch (error) {
  //       console.error("Error fetching dashboard stats:", error);
  //       return { userCount: 0, orderCount: 0, productCount: 0, revenue: 0, error: error.message };
  //     }
  //   },
  //   component: Dashboard
  // }

  dashboard: {
  handler: async (request, response, context) => {
    console.log("DASHBOARD HANDLER CALLED");
    console.log("Context currentAdmin:", context?.currentAdmin);

    const isAdmin = context?.currentAdmin?.role === 'admin';

    if (!isAdmin) {
      return { userCount: 0, orderCount: 0, productCount: 0, revenue: 0, isAdmin: false };
    }

    try {
      const [userCount, orderCount, productCount, revenue] = await Promise.all([
        User.count(),
        Order.count(),
        Product.count(),
        Order.sum('totalAmount'),
      ]);
      console.log("Stats:", { userCount, orderCount, productCount, revenue });
      return { userCount, orderCount, productCount, revenue: revenue || 0, isAdmin: true };
    } catch (error) {
      console.error("Dashboard handler error:", error);
      return { userCount: 0, orderCount: 0, productCount: 0, revenue: 0, isAdmin: true, error: error.message };
    }
  },
  component: Dashboard
}

 
}


