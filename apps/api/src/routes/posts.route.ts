import { prisma } from "@/config";
import { Router } from "express";
const postRouter: Router = Router()
import { createPost, getPosts ,getUserProfile} from "@/controllers/post.controller";

postRouter.get('/posts',getPosts)
postRouter.post('/posts',createPost)
postRouter.get('/users/:username',getUserProfile)
export { postRouter }