import { Request, Response } from 'express'
import { prisma } from '@/config/index'

//store active sse connections
let sseClients: Response[] = []

//sse connection endpoint - clients subscribe to post updates
export const subscribeToPostUpdates = async (req: Request, res: Response) => {

    res.writeHead(200, {
        "content-type": 'text/event-stream',
        "cache-control": 'no-cache',
        'connection': 'keep-alive',
        'X-Accel-Buffering': "no"
    })
    //send initial connection confirmation
    res.write('data:{"type":"connected"}\n\n')

    sseClients.push(res)
    
    //handle client disconnect
    req.on('close', () => {
        sseClients = sseClients.filter(client => client !== res);
    })
}

// Function to broadcast updates to all clients subscribed to a specific post
export const broadcastPostUpdate = (postId: string, data: any) => {
    const message = `data:${JSON.stringify(data)}\n\n`;
    sseClients.forEach(client => {
        try {
            client.write(message);
        } catch (error) {
            console.error("Broadcast error:", error);
        }
    });
}

// like/unlike endpoint  : Like → Update DB → Broadcast → Return response
export const postLikes = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = req.user?.id;
        if (!authenticatedUserId) {
            return res.status(401).json('authenticated user not found')
        }

        const postId = req.params.postId
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        //check existing like
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: authenticatedUserId,
                    postId: postId
                }
            }
        })

        let updatedPost
        let isliked: boolean;

        if (existingLike) {
            //unlike:remove like
            updatedPost = await prisma.$transaction(async (tx) => {
                await tx.like.delete({
                    where: { id: existingLike.id }
                })
                return await tx.post.update({
                    where: { id: postId },
                    data: { likesCount: { decrement: 1 } },
                    include: {
                        likes: {
                            select: { userId: true }
                        }
                    }
                })
            })

            isliked = false
        } else {
            // like ,create new like
            updatedPost = await prisma.$transaction(async (tx) => {
                await tx.like.create({
                    data: { userId: authenticatedUserId, postId: postId }
                });

                return await tx.post.update({
                    where: { id: postId },
                    data: { likesCount: { increment: 1 } },
                    include: {
                        likes: {
                            select: { userId: true }
                        }
                    }
                })
            })
            isliked = true
        }
        //broadcast update to all sse clients
        broadcastPostUpdate(postId, {
            type: 'likeUpdate',
            postId,
            likesCount: updatedPost.likesCount,
            userId: authenticatedUserId,
            isLiked: isliked,
            likedBy: updatedPost.likes.map(like => like.userId)
        })
        // Return response to the client who triggered the like
        return res.status(200).json({
            message: 'Success',
            liked: isliked,
            likesCount: updatedPost.likesCount
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json('message:server error')
    }
}

// view endpoint 
export const postViews = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        if (!userId) {
            return res.status(400).json({ message: 'userid is not defined' })
        }
        const postId = req.params.postId
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }
        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        let updatedPost
        let isViewed: boolean = false;

        //check existing like
        const existingView = await prisma.view.findUnique({
            where: {
                userId_postId: {
                    postId: postId,
                    userId: userId
                }
            }
        })
        //increase the view counter
        if (!existingView) {
            updatedPost = await prisma.$transaction(async (tx) => {
                await tx.view.create({
                    data: { userId: userId, postId: postId }
                })

                return tx.post.update({
                    where: { id: postId },
                    data: { viewsCount: { increment: 1 } },
                    include: {
                        View: { select: { userId: true } }
                    }
                })
            })
            isViewed = true
        } else {
            // Fetch current post data even if already viewed
            updatedPost = await prisma.post.findUnique({
                where: { id: postId },
                include: {
                    View: { select: { userId: true } }
                }
            })
        }
        if (updatedPost) {
            broadcastPostUpdate(postId, {
                type: 'viewUpdate',
                postId,
                viewsCount: updatedPost.viewsCount,
                userId: userId,
                isViewed: isViewed,
                viewedBy: updatedPost.View.map(view => view.userId)
            })
        }
        // Return response to the client who triggered the like
        return res.status(200).json({
            message: 'Success',
            viewed: isViewed,
            viewsCount: updatedPost?.viewsCount
        })
    } catch (error) {
        console.error(error);
        return res.json({ message: "server error" })
    }
}


