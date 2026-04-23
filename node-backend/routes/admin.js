import express from 'express';
import { getAllUsers, getUserDetails, getAllResults, getStats } from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.get('/results', getAllResults);

export default router;
