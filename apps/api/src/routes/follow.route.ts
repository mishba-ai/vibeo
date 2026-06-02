import { followUser, unfollowUser, getMyFollowers, getMyFollowing, checkFollowStatus } from "@/controllers/follow.controller.js";
import { Router } from "express";
const followRouter: Router = Router()

followRouter.post('/:username/follow', followUser)
followRouter.delete('/:username/follow', unfollowUser)
followRouter.get('/:username/following', getMyFollowing)
followRouter.get('/:username/followers', getMyFollowers)
followRouter.get('/:username/follow/status',checkFollowStatus)

export {followRouter}