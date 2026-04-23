import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { signup, login, me } from './controllers/authController.js';
import { authenticate } from './middlewares/auth.js';
import { adminLogin, getAllUsers } from './controllers/adminController.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:8080"],
  credentials: true
}));
app.use(express.json());

// Routes with /api prefix
app.post('/api/signup', signup);
app.post('/api/login', login);
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/users', getAllUsers);
app.get('/api/me', authenticate, me);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
