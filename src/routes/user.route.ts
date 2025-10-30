import express from "express"
import * as userController from "../controllers/user.controller"
import { verifyToken } from "../middlware/auth.middleware"

const router = express.Router()

router.get("/:id", verifyToken, userController.getUserById)
router.put("/:id", verifyToken, userController.updateUser)
router.delete("/:id", verifyToken, userController.deleteUser)

export default router