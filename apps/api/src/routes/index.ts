import { Router } from 'express'
import type { Router as ExpressRouter } from 'express'
const router: ExpressRouter = Router()
import { authRouter } from './auth.route.js'
import { postRouter } from './posts.route.js'
import { protect } from "@/middlewares/auth.middleware.js";
import { uploadRouter } from './upload.route.js'
import { followRouter } from './follow.route.js'
import { chatRouter } from './chat.route.js'

// mount all routes with their prefixes

router.use('/', postRouter)
router.use('/upload', uploadRouter)
router.use('/', protect, followRouter)
router.use('/chat', protect, chatRouter)

export {
    router, authRouter, postRouter, uploadRouter, followRouter, chatRouter
}