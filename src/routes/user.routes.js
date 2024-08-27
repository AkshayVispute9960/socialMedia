import { Router } from "express"

import { loginUser, registerUser ,logOutUser,refreshAccessToken,changeCurrentPassword} from "../controllers/user.controller.js"

import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/logout').get(verifyJWT, logOutUser)
router.route('/refreshAccessToken').post( refreshAccessToken )
router.route('/changeCurrentPassword').post(verifyJWT,changeCurrentPassword)

export default router

//localhost127.0.0.1