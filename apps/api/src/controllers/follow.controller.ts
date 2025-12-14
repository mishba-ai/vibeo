import { Request, Response } from 'express'
import { prisma } from '@/config/index'

const followUser = async(req:Request,res:Response) =>  {
// on following user 
}

const unfollowUser = async(req:Request,res:Response) =>  {

}

// Only I can see MY followers list
export const getMyFollowers = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        if (!userId) {
            return res.status(404).json({ message: "User not found" })
        }
        const followers = await prisma.follow.findMany({
            where: {
                followingId: userId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatar: true,
                    }
                }
            }
        })
        // Transform the data to return a cleaner structure
        const followersList = followers.map(follow => ({
            followId: follow.id,
            followedAt: follow.createdAt,
            user: {
                id: follow.follower.id,
                username: follow.follower.username,
                displayName: follow.follower.displayName,
                avatar: follow.follower.avatar
            }
        }))
        if (followers.length === 0) {
            return res.status(200).json({ message: "No followers yet", followers: [] })
        }
        res.status(200).json({ followers: followersList })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })

    }
}

export const getMyFollowing = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(404).json("user not found");
        }

        const following = await prisma.follow.findMany({
            where: {
                followerId: userId
            },
            include: {
                following: {
                    select: {
                        avatar: true,
                        id: true,
                        displayName: true,
                        username: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        //
        const followingList = following.map(follow => ({
            avatar: follow.following.avatar,
            displayName: follow.following.displayName,
            id: follow.following.id,
            username: follow.following.username

        }))
        res.status(200).json({ following: followingList })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' })
    }
}


