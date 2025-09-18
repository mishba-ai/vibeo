import { Router } from 'express'
import type { Router as ExpressRouter } from 'express'
const router: ExpressRouter = Router()
import { authRouter } from './auth.route'
import {postRouter} from './posts.route'
import { protect } from "@/middlewares/auth.middleware";

// mount all routes with their prefixes
// router.use('/',postRouter)
router.use('/',protect, postRouter)


export {
    router,authRouter,postRouter
}