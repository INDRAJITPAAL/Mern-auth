import express from 'express';
const router = express.Router();
import { login, register, logout, sendOTP, verifyOTP, sendResetOtp, resetPassword, profile } from '../controllers/Auth.controller.ts';
import asignIdInLocals from '../middlewares/AssignIdOnLocals.middleware.ts';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.ts';

//@ts-ignore
router.post('/register', register);
//@ts-ignore
router.post('/login', login);

//@ts-ignore
router.post('/logout', logout);
//@ts-ignore
router.post('/resetotp', sendResetOtp);
//@ts-ignore
router.post('/resetpassword', resetPassword);
//@ts-ignore
router.post('/verify-email', isAuthenticated, asignIdInLocals, sendOTP);
//@ts-ignore
router.post('/verifyotp', isAuthenticated, asignIdInLocals, verifyOTP);

export default router;