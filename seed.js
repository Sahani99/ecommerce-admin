import { sequelize, User, Category, Product } from './src/models/index.js';

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
    });
    console.log('✅ Admin user created: admin@test.com / password123');

    // 3. Create a Regular User (To test restricted access)
    await User.create({
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
    });
    console.log('✅ Regular user created: user@test.com / password123');

    // 4. Create initial Category
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Gadgets and devices',
    });

    // 5. Create initial Product
    await Product.create({
      name: 'Laptop Pro',
      description: 'High performance laptop',
      price: 1200.00,
      stock: 10,
      categoryId: electronics.id, // Linking to the category created above
    });
    console.log('✅ Demo Category and Product created');

    console.log('🚀 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();