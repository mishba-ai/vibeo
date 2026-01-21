import { Router } from 'express'
import type { Router as ExpressRouter } from 'express'
const router: ExpressRouter = Router()
import { authRouter } from './auth.route'
import { postRouter } from './posts.route'
import { protect } from "@/middlewares/auth.middleware";
import { uploadRouter } from './upload.route'
import { followRouter } from './follow.route'
import { chatRouter } from './chat.route'

// mount all routes with their prefixes

router.use('/', postRouter)
router.use('/upload', uploadRouter)
router.use('/', protect, followRouter)
router.use('/chat', protect, chatRouter)

export {
    router, authRouter, postRouter, uploadRouter, followRouter, chatRouter
}