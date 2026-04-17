// build-admin.js
import AdminJS from 'adminjs';
import { adminOptions } from './src/admin/options.js';

const build = async () => {
  console.log('🔨 Starting AdminJS Production Bundle...');
  const admin = new AdminJS(adminOptions);
  
  // This command creates the .adminjs folder and the bundle
  await admin.initialize();
  
  console.log('✅ Bundle generated.');
  process.exit(0);
};

build().catch(err => {
  console.error(err);
  process.exit(1);
});