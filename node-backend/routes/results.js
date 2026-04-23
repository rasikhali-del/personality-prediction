import express from 'express';
import { saveResult, getUserResults } from '../controllers/resultsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All result routes require authentication
router.post('/save', authenticate, saveResult);
router.get('/', authenticate, getUserResults);

export default router;
