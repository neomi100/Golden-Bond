import mongoose, { Model, Document } from 'mongoose';
import logger from './logger.service';

const dbName = 'Golden-Bond'
let dbConnect: mongoose.Connection | null = null
const MONGO_URI = process.env.MONGO_URI!


async function connectDB() {
  if (dbConnect) return dbConnect
  try {
    await mongoose.connect(MONGO_URI);
    dbConnect = mongoose.connection.useDb(dbName)
    console.log("MongoDB Connected...");
  } catch (error) {
    logger.error('Cannot Connect to DB', error)
    throw error
  }
};

async function getCollection<T extends Document>(
  model: Model<T>
): Promise<mongoose.Collection> {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI);
    }
    return model.collection;
  } catch (error) {
    logger.error('Failed to get Mongo collection', error)
    throw error
  }
}

const dbService = {
  connectDB,
  getCollection
};

export default dbService; 