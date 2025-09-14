import { Router } from 'express'
import type { Router as ExpressRouter } from 'express'
const router: ExpressRouter = Router()
import { authRouter } from './auth.route'


// mount all routes with their prefixes
// router.use('/auth', authRouter)



export {
    router,authRouter
}