import express from 'express';
import { createCookieController, getCookieController } from '../controllers/cookie.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();


router.post('/create', authMiddleware, createCookieController);
router.get('/get', authMiddleware, getCookieController);

export const cookieRouter = router;

