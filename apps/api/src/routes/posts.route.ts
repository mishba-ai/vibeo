import { prisma } from "@/config";
import { Router } from "express";
const postRouter: Router = Router()
import { createPost, getPosts } from "@/controllers/post.controller";

postRouter.get('/posts',getPosts)
postRouter.post('/posts',createPost)

export { postRouter }