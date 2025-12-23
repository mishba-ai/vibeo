import { Request, Response } from 'express'
import { prisma } from '@/config/index'


//store active sse connections
const sseClients = new Map<string, Response[]>()

//sse connection endpoint - clients subscribe to post updates
export const subscribeToPostUpdates = async (req: Request, res: Response) => {
    const postId = req.params.postId
    if (!postId) {
        return res.status(400).json({ message: 'post id is required' })
    }

    res.writeHead(200, {
        "content-type": 'text/event-stream',
        "cache-control": 'no-cache',
        'connection': 'keep-alive',
        'X-Accel-Buffering': "no"
    })
    //send initial connection confirmation
    res.write('data:{"type":"connected"}\n\n')

    //store this client connection 
    if (!sseClients.has(postId)) {
        sseClients.set(postId, [])
    }
    sseClients.get(postId)!.push(res)

    //send current like count when client connects
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                likesCount: true,
                likes: {
                    select: {
                        userId: true
                    }
                }
            }
        })

        if (post) {
            res.write(`data:${JSON.stringify({
                type: 'initial',
                postId,
                likesCount: post.likesCount,
                likedBy: post.likes.map(like => like.userId)
            })}\n\n`)
        }
    } catch (error) {
        console.error(error);
    }

    //handle client disconnect
    req.on('close', () => {
        const clients = sseClients.get(postId)
        if (clients) {
            // Remove the disconnected client from the list
            const index = clients.indexOf(res)
            if (index != -1) {
                clients.splice(index, 1)
            }
            //clean up if no more clients for this post
            if (clients.length === 0) {
                sseClients.delete(postId)
            }
        }
    })
}

// Function to broadcast updates to all clients subscribed to a specific post
export const broadcastPostUpdate = (postId: string, data: any) => {
    // Retrieve the list of clients subscribed to the given postId
    const clients = sseClients.get(postId)
    // Check if there are any clients subscribed to this post
    if (clients) {
        // Prepare the message to be sent to clients in the SSE format
        const message = `data:${JSON.stringify(data)}\n\n`
        // Iterate over each client connection
        clients.forEach(client => {
            try {
                // Attempt to send the message to the client
                client.write(message)
            } catch (error) {
                // Log any errors that occur while trying to send the message
                console.error(error);
            }
        })
    }
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
            isLiked:isliked,
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

//clean up disconnected clients periodically 

setInterval(() => {
    sseClients.forEach((clients, postId) => {
        const activeClients = clients.filter(client => !client.destroyed)
        if (activeClients.length === 0) {
            sseClients.delete(postId)
        }
        else if (activeClients.length !== clients.length) {
            sseClients.set(postId, activeClients)
        }
    })
}, 60000) //clean up every minute

