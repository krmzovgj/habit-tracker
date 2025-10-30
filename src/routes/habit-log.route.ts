import express from 'express'
import { verifyToken } from '../middlware/auth.middleware'
import * as habitLogController from '../controllers/habit-log.controller'

const router = express.Router()

router.post("/:habitId", verifyToken, habitLogController.completeHabit)

export default router