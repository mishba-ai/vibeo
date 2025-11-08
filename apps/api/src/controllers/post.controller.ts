import { Request, Response } from 'express'
import { prisma } from '@/config/index'
import multer from 'multer'

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
                media: media  || [],
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

// Get only user profile with its user timeline/posts only not other posts 
const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params
        const decodedUsername = decodeURIComponent(username!)
        console.log('Searching for username:', decodedUsername)

        const user = await prisma.user.findUnique({
            where: {
                username: decodedUsername,
            },
            include: {
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
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error('Error fetching user profile:', error)
        res.status(500).json({ message: "Server error" })
    }
}

export { createPost, getPosts, getUserProfile }