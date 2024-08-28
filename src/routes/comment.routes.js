import { Router } from 'express';
import { commentPost } from '../controllers/comment.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/commentPost/:postId').post(verifyJWT, commentPost);


export default router
