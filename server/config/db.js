import mongoose from 'mongoose';

export const connectMongo = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/airO11y?replicaSet=rs0';
console.log('process.env.MONGO_URI', process.env.MONGO_URI);
console.log('MONGO_URI ',MONGO_URI)

  console.log("trying to connect ", MONGO_URI);
  try {
    await mongoose.connect(MONGO_URI);
   // await mongoose.connect('mongodb://localhost:27017/airO11y?replicaSet=rs0');
    
    console.log('[✓] MongoDB connected', mongoose.connection.name);
  } catch (err) {
    console.error('[X] MongoDB connection error:', err);
    process.exit(1);
  }
};
