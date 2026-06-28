import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: './.env' });

// Import Model
import Package from '../models/Package.js';

async function testQuery() {
  const dbUri = process.env.MONGODB_URI;
  console.log('Connecting to:', dbUri);
  await mongoose.connect(dbUri);
  console.log('Connected!');

  // Fetch one package
  const pkg = await Package.findOne({});
  if (!pkg) {
    console.log('No package found in DB!');
  } else {
    console.log('Hydrated package document gallery:', JSON.stringify(pkg.gallery, null, 2));
    
    // Fetch raw document using findOne().lean() to compare
    const rawPkg = await Package.findOne({}).lean();
    console.log('Raw package document from MongoDB gallery:', JSON.stringify(rawPkg.gallery, null, 2));
  }

  await mongoose.connection.close();
}

testQuery().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
