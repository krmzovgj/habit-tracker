import express from 'express'
import * as authController from '../controllers/auth.controller'

const router = express.Router()

router.post("/create-account", authController.createAccount)
router.post("/sign-in", authController.signIn)

export default router

