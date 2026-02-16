import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wtp-designs');
  const email = process.env.ADMIN_EMAIL || 'admin@wtp.com';
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log('Existing user set as admin:', email);
  } else {
    await User.create({ name: 'Admin', email, password: process.env.ADMIN_PASSWORD || 'admin123', role: 'admin' });
    console.log('Admin created:', email);
  }
  process.exit(0);
}
seed().catch((e) => { console.error(e); process.exit(1); });
