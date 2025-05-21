import express from 'express';
import { createCookieController, getCookieController, updateCookieController, deleteCookieController, getCookiesProviderController } from '../controllers/cookie.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();


router.post('/create', authMiddleware, createCookieController);
router.get('/get', authMiddleware, getCookieController);
router.put('/update', authMiddleware, updateCookieController);
router.delete('/delete', authMiddleware, deleteCookieController);
router.get('/get-provider', authMiddleware, getCookiesProviderController);

export const cookieRouter = router;

