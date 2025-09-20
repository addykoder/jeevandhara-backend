import { Router } from 'express';
import login from '../controllers/auth/login';
import signup from '../controllers/auth/signup';
import verifyLogin from '../controllers/auth/verifyLogin';
import { loginLimiter, signUpLimiter, verifyLoginLimiter } from '../middlewares/rateLimiter';

export const router = Router();

router.post('/login',loginLimiter, login);
router.post('/signup',signUpLimiter, signup);
router.post('/verifyLogin',verifyLoginLimiter, verifyLogin);
