import { Request, Response } from 'express'
import { prisma } from '@/config/index'

const createPost = async (req: Request, res: Response) => {
    try {
        // Capture the content AND mediaUrl from the request body
        const { content, media } = req.body

        // Validate: must have either content or mediaUrl
        if (!content && !media) {
            return res.status(400).json({ message: "Post must have content or media" })
        }

        // Get the authenticated user's ID from req.user
        const authorId = req.user?.id
        if (!authorId) {
            return res.status(401).json({ message: "User not authenticated" })
        }

        // Store the post in the database 
        const newPost = await prisma.post.create({
            data: {
                content: content || '',
                media: media || [],
                authorId: authorId
            },
            include: {
                author: true,
            },
        })

        // Send a success response 
        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        })
    } catch (error) {
        console.error('Error creating post:', error)
        res.status(500).json({ message: "Server error" })
    }
}

//feed
const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            },

            include: {
                author: true,
                likes: true,
                comments: true,

            }
        })
        res.status(200).json(posts)
    } catch (error) {
        console.error('Error fetching posts:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

// Get only user profile with its user for timeline 
const getUserProfile = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = req.user?.id

        const { username } = req.params
        const decodedUsername = decodeURIComponent(username!)
        console.log('Searching for username:', decodedUsername)


        const user = await prisma.user.findUnique({
            where: {
                username: decodedUsername,
            },
            select: {
                id: true,
                username: true,
                followersCount: true,
                followingCount: true,
                avatar: true,
                joinDate: true,

                postsCount: true,

                posts: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        author: true,
                        likes: true,
                        comments: true

                    }
                }

            },
        })


        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        //Check if authenticated user is following this profile
        let isFollowing = false
        if (authenticatedUserId && authenticatedUserId !== user.id) {
            const followRelation = await prisma.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: authenticatedUserId,
                        followingId: user.id
                    }
                }
            })
            isFollowing = !!followRelation
        }
        res.status(200).json({
            ...user,
            isFollowing
        })
    } catch (error) {
        console.error('Error fetching user profile:', error)
        res.status(500).json({ message: "Server error" })
    }
}

const getFollowingFeeds = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = req.user?.id;
        if (!authenticatedUserId) {
            return res.status(401).json("authenticated user not found")
        }

        const followingFeed = await prisma.post.findMany(
            {
                where: {
                    author: {
                        followers: {
                            some: { //At least one match
                                followerId: authenticatedUserId
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            displayName: true,

                        }

                    },
                    likes: true,
                    comments: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    username: true,
                                    displayName: true,
                                    avatar: true
                                }
                            }
                        }
                    }
                }
            }

        )
        res.status(200).json(followingFeed)
    } catch (error) {
        console.error(error);
        return res.status(500).json("server error")
    }

}


export { createPost, getPosts, getUserProfile, getFollowingFeeds }