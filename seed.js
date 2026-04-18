import { sequelize, User, Category, Product, Order, OrderItem, Setting } from './src/models/index.js';

const seedDatabase = async () => {
  try {
    // 1. Sync Database (Warning: force: true will wipe your DB every time you run this)
    // Use force: true only during development to start fresh
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // 2. Create Admin User
    // Note: The password hashing happens automatically due to the 'beforeCreate' hook in your User model
    const admin = await User.create({
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      name: 'John'
    });
    console.log('✅ Admin user created: admin@test.com / password123');

    // 3. Create a Regular User (To test restricted access)
    const user1 = await User.create({
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
      name: 'Jane'
    });
    console.log('✅ Regular user created: user@test.com / password123');

    // 4. Create another Admin User
    const admin2 = await User.create({
      email: 'admin2@test.com',
      password: 'password123',
      role: 'admin',
      name: 'Bob'
    });
    console.log('✅ Second admin user created: admin2@test.com / password123');

    // 5. Create another Regular User
    const user2 = await User.create({
      email: 'user2@test.com',
      password: 'password123',
      role: 'user',
      name: 'Alice'
    });
    console.log('✅ Second regular user created: user2@test.com / password123');

    // 6. Create initial Categories
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Gadgets and devices',
    });

    const clothing = await Category.create({
      name: 'Clothing',
      description: 'Fashion and apparel',
    });

    const books = await Category.create({
      name: 'Books',
      description: 'Educational and leisure reading',
    });

    const home = await Category.create({
      name: 'Home & Garden',
      description: 'Home improvement and gardening',
    });

    // 7. Create initial Products
    const laptop = await Product.create({
      name: 'Laptop Pro',
      description: 'High performance laptop',
      price: 1200.00,
      stock: 10,
      categoryId: electronics.id,
    });

    const phone = await Product.create({
      name: 'Smartphone X',
      description: 'Latest smartphone with advanced features',
      price: 800.00,
      stock: 15,
      categoryId: electronics.id,
    });

    const tshirt = await Product.create({
      name: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 25.00,
      stock: 50,
      categoryId: clothing.id,
    });

    const jeans = await Product.create({
      name: 'Blue Jeans',
      description: 'Classic blue denim jeans',
      price: 60.00,
      stock: 30,
      categoryId: clothing.id,
    });

    const novel = await Product.create({
      name: 'Bestseller Novel',
      description: 'Award-winning fiction novel',
      price: 15.00,
      stock: 100,
      categoryId: books.id,
    });

    const cookbook = await Product.create({
      name: 'Italian Cookbook',
      description: 'Recipes from Italy',
      price: 20.00,
      stock: 40,
      categoryId: books.id,
    });

    const gardenTool = await Product.create({
      name: 'Garden Shovel',
      description: 'Durable garden shovel',
      price: 35.00,
      stock: 20,
      categoryId: home.id,
    });

    const plant = await Product.create({
      name: 'Indoor Plant',
      description: 'Beautiful indoor decorative plant',
      price: 45.00,
      stock: 25,
      categoryId: home.id,
    });

    console.log('✅ Demo Categories and Products created');

    // 8. Create sample Orders
    const order1 = await Order.create({
      userId: admin.id,
      totalAmount: 1200.00,
      status: 'completed'
    });

    const order2 = await Order.create({
      userId: admin.id,
      totalAmount: 825.00,
      status: 'pending'
    });

    const order3 = await Order.create({
      userId: user1.id,
      totalAmount: 85.00,
      status: 'completed'
    });

    const order4 = await Order.create({
      userId: user2.id,
      totalAmount: 60.00,
      status: 'completed'
    });

    const order5 = await Order.create({
      userId: user2.id,
      totalAmount: 45.00,
      status: 'pending'
    });

    // 9. Create OrderItems for the orders
    await OrderItem.create({
      orderId: order1.id,
      productId: laptop.id,
      quantity: 1,
      price: 1200.00
    });

    await OrderItem.create({
      orderId: order2.id,
      productId: phone.id,
      quantity: 1,
      price: 800.00
    });

    await OrderItem.create({
      orderId: order2.id,
      productId: tshirt.id,
      quantity: 1,
      price: 25.00
    });

    await OrderItem.create({
      orderId: order3.id,
      productId: novel.id,
      quantity: 1,
      price: 15.00
    });

    await OrderItem.create({
      orderId: order3.id,
      productId: cookbook.id,
      quantity: 1,
      price: 20.00
    });

    await OrderItem.create({
      orderId: order3.id,
      productId: tshirt.id,
      quantity: 2,
      price: 25.00
    });

    await OrderItem.create({
      orderId: order4.id,
      productId: jeans.id,
      quantity: 1,
      price: 60.00
    });

    await OrderItem.create({
      orderId: order5.id,
      productId: plant.id,
      quantity: 1,
      price: 45.00
    });

    console.log('✅ Sample Orders and OrderItems created');

    // 10. Create sample Settings
    await Setting.create({
      key: 'site_title',
      value: 'E-Shop Admin Panel'
    });

    await Setting.create({
      key: 'site_description',
      value: 'Manage your e-commerce store efficiently'
    });

    await Setting.create({
      key: 'contact_email',
      value: 'support@eshop.com'
    });

    await Setting.create({
      key: 'currency',
      value: 'USD'
    });

    await Setting.create({
      key: 'tax_rate',
      value: '0.08'
    });

    console.log('✅ Sample Settings created');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();