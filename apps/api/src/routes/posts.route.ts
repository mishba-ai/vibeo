import { Router } from "express";
const postRouter: Router = Router()
import { createPost, getFollowingFeeds, getPosts, getUserProfile } from "@/controllers/post.controller";
import { postLikes, subscribeToPostUpdates } from "@/controllers/postRealtime.controller";
import { protect } from "@/middlewares/auth.middleware";


postRouter.get('/posts', getPosts)
postRouter.post('/posts',protect, createPost)
postRouter.get('/users/:username', getUserProfile)
postRouter.get('/posts/following', protect, getFollowingFeeds)
postRouter.get('/posts/:postId/subscribe', subscribeToPostUpdates)
postRouter.post('/posts/:postId/like', protect, postLikes)

export { postRouter }