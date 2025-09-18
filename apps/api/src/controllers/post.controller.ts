import { Request, Response } from 'express'
import { prisma } from '@/config/index'
import { request } from 'http'

const createPost = async (req: Request, res: Response) => {
    try {
        //capture the content from the req body
        const { content } = req.body
        if (!content) {
            return res.status(400).json({ message: "Post content is required" })
        }

        //  Get the authenticated user's ID from req.user
        const authorId = req.user?.id
        if (!authorId) {
            return res.status(401).json({ message: "user not authenticated" })
        }

        //store the post in the database using prisma
        const newPost = await prisma.post.create({
            data: {
                content: content,
                authorId: authorId
            }, include: {
                author: true,
            },
        });

        //send a success response 
        res.status(201).json({
            message: 'post created successfully',
            post: newPost
        })
    } catch (error) {
        console.error('errr creating post ', error)
        res.status(500).json({ message: "server error " })
    }
}

const getPosts = async (req:Request,res:Response) => {
try {
    const posts = await prisma.post.findMany({
        orderBy:{
            createdAt:'desc'
        },
        include:{
            author:true,
            likes:true,
            comments:true,
        }
    })
    res.status(200).json(posts)
} catch (error) {
      console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
}
}
export { createPost,getPosts } 