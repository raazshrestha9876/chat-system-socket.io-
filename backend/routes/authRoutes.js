import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getProfile, logoutUser, otherUser } from '../controllers/authController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// Register Route
router.post('/register', 
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    registerUser
);

// Login Route with Validation
router.post('/login',
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    loginUser
);

// Profile Route (Authenticated)
router.get('/profile', authenticate, getProfile);
router.get('/other-user', authenticate, otherUser);

// Logout Route (Authenticated)
router.get('/logout', authenticate, logoutUser);

export { router as authRoutes };
