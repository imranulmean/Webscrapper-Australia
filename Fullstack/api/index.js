import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoutes from './routes/product.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import WebSocket,{ WebSocketServer }  from 'ws';
import http from 'http';


dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();
const server= http.createServer(app);
const wss = new WebSocketServer({ server });
const clients= new Map();

app.use(express.json());
app.use(cookieParser());



server.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/products', productRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

