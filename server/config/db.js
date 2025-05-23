import mongoose from 'mongoose';

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[✓] MongoDB connected');
  } catch (err) {
    console.error('[X] MongoDB connection error:', err);
    process.exit(1);
  }
};
