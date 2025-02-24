import express from "express";
import session from 'express-session';
import cors from "cors";
import dotenv from "dotenv";
import MongoStore from 'connect-mongo';
import mongoose from "mongoose";
import authRoutes from './api/authentication/authRoutes'
import postRoutes from './api/posts/postRoutes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 0;
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not defined in environment variables!');
}

const connectDB = async (): Promise<void> => {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error);
      process.exit(1); 
    }
  };
  connectDB();
app.use(session({
  secret: sessionSecret || '', 
  resave: false,      
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60
}),
cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24
  }  
})); 
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/post', postRoutes);


app.get("/", (req, res) => {
    res.send("Hello from Backend!");
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
      console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
      console.log('Process terminated');
  });
});





