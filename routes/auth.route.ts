
import express from 'express';
import {gettokens, meta, register, requestDeviceVerification, requestOtp} from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', register);

router.post('/passwordless/start', requestDeviceVerification);

router.post('/passwordless/request-otp', requestOtp);

router.post('/token', gettokens);

router.patch('/meta', meta);
// router.post('/login', authController.login);
// router.post('/logout', authController.logout);
export default router;