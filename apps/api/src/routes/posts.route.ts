import { Router } from "express";
const postRouter: Router = Router()
import { createPost, getFollowingFeeds, getPosts ,getUserProfile} from "@/controllers/post.controller";

postRouter.get('/posts',getPosts)
postRouter.post('/posts',createPost)
postRouter.get('/users/:username',getUserProfile)
postRouter.get('/posts/following',getFollowingFeeds)
export { postRouter }