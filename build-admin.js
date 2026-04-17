import AdminJS from 'adminjs';
import { adminOptions } from './src/admin/options.js';

const build = async () => {
  console.log('🔨 Building AdminJS custom components...');
  const admin = new AdminJS(adminOptions);
  await admin.initialize();
  console.log('✅ Bundle created successfully.');
  process.exit(0);
};

build().catch((err) => {
  console.error(err);
  process.exit(1);
});