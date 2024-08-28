import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {toggleLike} from '../controllers/like.controller.js'
const router = Router()

router.route('/toggleLike/:postId').get(verifyJWT, toggleLike)

export default router