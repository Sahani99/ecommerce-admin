// admin/options.js - FINAL VERSION
import { ComponentLoader } from 'adminjs'
import { Op } from 'sequelize'
import { User, Product, Category, Order, OrderItem, Setting } from '../models/index.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const componentLoader = new ComponentLoader()

const Dashboard = componentLoader.add('Dashboard', path.resolve(__dirname, './components/Dashboard.jsx'))
const SettingsList = componentLoader.add('SettingsList', path.resolve(__dirname, './components/SettingsList.jsx'))
const Login = componentLoader.override('Login', path.resolve(__dirname, './components/Login.jsx'))

export const adminOptions = {
  componentLoader,
  rootPath: '/admin',
  branding: {
    companyName: 'E-Shop Admin',
    withMadeWithLove: false,
  },
  loginPath: '/admin/login',
  logoutPath: '/admin/logout',
  component: {
    Login
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
          price: { type: 'currency', props: { symbol: '$' } },
          categoryId: {
            reference: 'Category',
            isFilterable: true
          }
        },
        actions: {
          list: {
            isAccessible: true,
            before: async (request, context) => {
              if (context.currentAdmin?.role !== 'admin') {
                request.query = {
                  ...request.query,
                  filters: {
                    ...request.query?.filters,
                    stock: { [Op.gt]: 0 }
                  }
                };
              }
              return request;
            }
          }
        },
        sort: {
          sortBy: 'categoryId',
          direction: 'asc'
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
          userId: {
            reference: 'User',
            isFilterable: true
          },
          totalAmount: { type: 'currency', props: { symbol: '$' } }
        },
        actions: {
          list: {
            isAccessible: true,
            before: async (request, context) => {
              if (context.currentAdmin?.role !== 'admin') {
                request.query = {
                  ...request.query,
                  filters: {
                    ...request.query?.filters,
                    userId: context.currentAdmin.id,
                  },
                };
              }
              return request;
            }
          },
          show: {
            isAccessible: ({ currentAdmin, record }) => currentAdmin?.role === 'admin' || record?.params?.userId === currentAdmin?.id
          },
          edit: {
            isAccessible: ({ currentAdmin, record }) => currentAdmin?.role === 'admin' || record?.params?.userId === currentAdmin?.id
          },
          delete: {
            isAccessible: ({ currentAdmin, record }) => currentAdmin?.role === 'admin' || record?.params?.userId === currentAdmin?.id
          }
        }
      }
    },
    {
      resource: OrderItem,
      options: {
        navigation: { name: 'Sales', icon: 'List' },
        actions: {
          list: {
            isAccessible: true,
            before: async (request, context) => {
              if (context.currentAdmin?.role !== 'admin') {
                // Filter order items where order.userId = currentAdmin.id
                const userOrders = await Order.findAll({ where: { userId: context.currentAdmin.id }, attributes: ['id'] });
                const orderIds = userOrders.map(o => o.id);
                request.query = {
                  ...request.query,
                  filters: {
                    ...request.query?.filters,
                    orderId: orderIds,
                  },
                };
              }
              return request;
            }
          },
          show: {
            isAccessible: ({ currentAdmin, record }) => {
              // Check if the order belongs to the user
              return Order.findByPk(record?.params?.orderId).then(order => order?.userId === currentAdmin?.id || currentAdmin?.role === 'admin');
            }
          },
          edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
          delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' }
        }
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
    const userId = context?.currentAdmin?.id;
    const userName = context?.currentAdmin?.name || context?.currentAdmin?.email;

    if (!isAdmin) {
      try {
        const userOrders = await Order.findAll({ where: { userId }, include: [{ model: OrderItem, as: 'items' }] });
        const orderCount = userOrders.length;
        const orderItems = userOrders.flatMap(order => order.items);
        const availableProducts = await Product.findAll({ where: { stock: { [Op.gt]: 0 } }, include: [{ model: Category, as: 'category' }] });

        return {
          userName,
          orderCount,
          orderItems: orderItems.length,
          availableProducts,
          isAdmin: false
        };
      } catch (error) {
        console.error("Dashboard handler error for user:", error);
        return { userName, orderCount: 0, orderItems: 0, availableProducts: [], isAdmin: false, error: error.message };
      }
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


