import express, { Router } from 'express';
import { requireAuth } from '../../middlewares/require.auth.middleware';
import { log } from '../../middlewares/logger.middleware';
import postController from './postController';

const router: Router = express.Router();

router.post('/create', log, requireAuth, postController.createPost);
router.put('/edit/:postId', log, requireAuth, postController.editPost);

export default router;
