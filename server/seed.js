require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Faculty = require('./models/Faculty');

const users = [
  {
    name: 'Surya',
    email: 'surya@mits.edu',
    password: 'Surya@123',
    role: 'FACULTY',
    department: 'AIML',
    designation: 'Assistant Professor',
  },
  {
    name: 'Raghu',
    email: 'raghu@mits.edu',
    password: 'Surya@123',
    role: 'FACULTY',
    department: 'AIML',
    designation: 'Assistant Professor',
  },
  {
    name: 'Padma',
    email: 'padma@mits.edu',
    password: 'Surya@123',
    role: 'HOD',
    department: 'AIML',
    designation: 'Professor & HOD',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await Faculty.findOneAndUpdate(
      { email: u.email },
      { name: u.name, email: u.email, passwordHash, role: u.role, department: u.department, designation: u.designation },
      { upsert: true, new: true }
    );
    console.log(`✓ Seeded: ${u.name} (${u.role}) — ${u.email}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(err => { console.error(err); process.exit(1); });
