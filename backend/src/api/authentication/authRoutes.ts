import express, { Router } from 'express';
import { requireAuth } from '../../middlewares/require.auth.middleware';
import { log } from '../../middlewares/logger.middleware';
import authController from './authController';

const router: Router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', log, requireAuth, authController.logout);

export default router;
