import Router from "express"
import { registerUser, loginUser } from "../controllers/auth.controllers.js"
import authMiddleware from "../middlewares/auth.middlewares.js"

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

export default router
