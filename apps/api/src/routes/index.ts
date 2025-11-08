import { Router } from 'express'
import type { Router as ExpressRouter } from 'express'
const router: ExpressRouter = Router()
import { authRouter } from './auth.route'
import { postRouter } from './posts.route'
import { protect } from "@/middlewares/auth.middleware";
import { uploadRouter } from './upload.route'
// mount all routes with their prefixes
router.use('/', protect, postRouter)
router.use('/upload', uploadRouter)

export {
    router, authRouter, postRouter, uploadRouter
}