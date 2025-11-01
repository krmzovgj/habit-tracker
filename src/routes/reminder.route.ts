import express from 'express'
import { verifyToken } from '../middlware/auth.middleware'
import * as reminderController from '../controllers/reminder.controller'

const router = express.Router()

router.post("/", verifyToken, reminderController.createReminder)

export default router