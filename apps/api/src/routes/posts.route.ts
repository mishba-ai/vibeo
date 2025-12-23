import { Router } from "express";
const postRouter: Router = Router()
import { createPost, getFollowingFeeds, getPosts ,getUserProfile} from "@/controllers/post.controller";
import { postLikes,subscribeToPostUpdates } from "@/controllers/like.controller";

postRouter.get('/posts',getPosts)
postRouter.post('/posts',createPost)
postRouter.get('/users/:username',getUserProfile)
postRouter.get('/posts/following',getFollowingFeeds)
postRouter.get('/posts/:postId/subscribe',subscribeToPostUpdates)
postRouter.post('/posts/:postId/like',postLikes)

export { postRouter }