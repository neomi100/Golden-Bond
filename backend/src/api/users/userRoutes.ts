import express, { Router } from 'express';
import { requireAuth } from '../../middlewares/require.auth.middleware';
import { log } from '../../middlewares/logger.middleware';
import userController from './userController';

const router: Router = express.Router();

router.get('/getAll', log, requireAuth, userController.query);
router.put('/addFriend', log, requireAuth, userController.addFriend);
router.get('/yourFriends', log, requireAuth, userController.getYourFriends);

export default router;
