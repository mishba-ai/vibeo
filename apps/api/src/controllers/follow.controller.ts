import { Request, Response } from 'express'
import { prisma } from '@/config/index'
import { Prisma } from 'generated/prisma';
// import { Prisma } from '@prisma/client'; // Drop 'Follow' from here entirely

export const checkFollowStatus = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = req.user?.id;
        if (!authenticatedUserId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const targetUsername = req.params.username;
        const targetUser = await prisma.user.findUnique({
            where: { username: targetUsername },
            select: { id: true }
        });

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: authenticatedUserId,
                    followingId: targetUser.id
                }
            }
        });

        res.status(200).json({ isFollowing: !!isFollowing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const followUser = async (req: Request, res: Response) => {
    /*
    Causes the authenticated user to follow a specific user by their ID.
    */
    try {
        const authenticatedUserId = req.user?.id;
        if (!authenticatedUserId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const targetUsername = req.params.username;
        if (!targetUsername) {
            return res.status(404).json({ message: " user is not found " })
        }

        // Find the target user by username and get their ID
        const targetUser = await prisma.user.findUnique({
            where: {
                username: targetUsername
            },
            select: {
                id: true,
                username: true
            }
        })

        if (!targetUser) {
            return res.status(404).json({ message: 'user not found' })
        }

        //  Check if user is trying to follow themselves
        if (authenticatedUserId === targetUser.id) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }
        //  Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: authenticatedUserId,
                    followingId: targetUser.id
                }
            }
        })
        if (existingFollow) {
            return res.status(409).json({ message: 'you are already following this user' })
        }
        // Create the follow relationship and update counts in a transaction
        const result = await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
 
            //create follow record
            const follow = await tx.follow.create({
                data: {
                    followerId: authenticatedUserId,
                    followingId: targetUser.id
                }
            });

            //Increment target user's followers count
            await tx.user.update({
                where: { id: targetUser.id },
                data: { followersCount: { increment: 1 } }
            });

            await tx.user.update({
                where: { id: authenticatedUserId },
                data: { followingCount: { increment: 1 } }
            });
            return follow;
        });

        //return success response
        res.status(200).json({
            message: 'succefull followed user',
            follow: result
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' })
    }
}


export const unfollowUser = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = req.user?.id;
        if (!authenticatedUserId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const targetUsername = req.params.username;
        if (!targetUsername) {
            return res.status(404).json({ message: 'target user is not found' })
        }

        const targetUser = await prisma.user.findUnique({
            where: {
                username: targetUsername
            },
            select: {
                username: true,
                id: true
            }
        })

        if (!targetUser) {
            return res.status(404).json('target user not found')
        }

        // check if follow relationship exist
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: authenticatedUserId,
                    followingId: targetUser.id
                }
            }
        })
        if (!existingFollow) {
            return res.status(404).json('you are not following this user')
        }

        // delete the follow relationship and update counts in a transaction
        const result = await prisma.$transaction(async (tx:Prisma.TransactionClient) => {

            //create follow record
            const unfollow = await tx.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: authenticatedUserId,
                        followingId: targetUser.id
                    }
                }
            });

            //Increment target user's followers count
            await tx.user.update({
                where: { id: targetUser.id },
                data: { followersCount: { decrement: 1 } }
            });

            await tx.user.update({
                where: { id: authenticatedUserId },
                data: { followingCount: { decrement: 1 } }
            });
            return unfollow;
        });

        res.status(200).json({
            message: 'successful',
            unfollow: result
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' })
    }
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