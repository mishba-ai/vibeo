import { Router } from "express";
const postRouter: Router = Router()
import { createPost, getFollowingFeeds, getPosts, getUserProfile, singlePost } from "@/controllers/post.controller.js";
import { commentLike, commentView, getComments, postComments, postLikes, postViews, subscribeToPostUpdates } from "@/controllers/postRealtime.controller.js";
import { protect } from "@/middlewares/auth.middleware.js";

postRouter.get('/posts', getPosts)
postRouter.post('/posts',protect, createPost)
postRouter.get('/users/:username', getUserProfile)
postRouter.get('/posts/following', protect, getFollowingFeeds)
postRouter.get('/posts/subscribe', subscribeToPostUpdates)
postRouter.post('/posts/:postId/like', protect, postLikes)
postRouter.post('/posts/:postId/view', protect, postViews)
postRouter.post('/posts/:postId/comment', protect, postComments) 
postRouter.get('/posts/:postId/comments',getComments)
postRouter.get('/posts/:postId',singlePost)

postRouter.post('/comments/:commentId/like', protect, commentLike)
postRouter.post('/comments/:commentId/view', protect, commentView)

export { postRouter }