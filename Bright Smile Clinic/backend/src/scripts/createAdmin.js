// One-time internal script to seed the first admin account.
// Admin accounts are never created through a public signup route (see CLAUDE.md),
// so this is the only way to get one into the database.
//
// Run from backend/: node src/scripts/createAdmin.js "Admin Name" admin@brightsmile.com "SomePassword123" "+10000000000"
require('dotenv').config();
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/config');
const User = require('../models/user.model');

async function run() {
  const [name, email, password, phone] = process.argv.slice(2);

  if (!name || !email || !password || !phone) {
    console.error('Usage: node src/scripts/createAdmin.js "<name>" <email> <password> <phone>');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.error(`A user with email ${email} already exists (role: ${existing.role}).`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const admin = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    role: 'admin',
    status: 'active',
  });

  console.log(`Admin account created: ${admin.email} (id: ${admin._id})`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error('Failed to create admin:', error.message);
  process.exit(1);
});
