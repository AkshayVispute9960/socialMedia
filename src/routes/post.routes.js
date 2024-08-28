import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {postPicture} from '../controllers/post.controller.js'
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route('/postPicture').post(verifyJWT, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), postPicture)


export default router