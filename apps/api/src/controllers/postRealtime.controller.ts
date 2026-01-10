import { Request, Response } from 'express'
import { prisma } from '@/config/index'
import { es, id } from 'zod/v4/locales'

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
    const message = `data:${JSON.stringify({ postId, ...data })}\n\n`;

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
            return res.status(401).json({ message: 'Authenticated user not found' })
        }

        const postId = req.params.postId
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        // Check both post and comment tables
        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ message: 'Post or comment not found' });
        }

        // Check existing like
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: authenticatedUserId,
                    postId: postId
                }
            }
        })

        let updatedEntity;
        let isLiked: boolean;

        if (existingLike) {
            // Unlike
            updatedEntity = await prisma.$transaction(async (tx) => {
                await tx.like.delete({ where: { id: existingLike.id } })


                return await tx.post.update({
                    where: { id: postId },
                    data: { likesCount: { decrement: 1 } },
                    include: { likes: { select: { userId: true } } }
                })


            })
            isLiked = false
        } else {
            // Like
            updatedEntity = await prisma.$transaction(async (tx) => {
                await tx.like.create({
                    data: { userId: authenticatedUserId, postId: postId }
                });


                return await tx.post.update({
                    where: { id: postId },
                    data: { likesCount: { increment: 1 } },
                    include: { likes: { select: { userId: true } } }
                })

            })
            isLiked = true
        }

        // Broadcast update
        broadcastPostUpdate(postId, {
            type: 'likeUpdate',
            postId,
            likesCount: updatedEntity.likesCount,
            userId: authenticatedUserId,
            isLiked: isLiked,
            likedBy: updatedEntity.likes.map(like => like.userId)
        })

        return res.status(200).json({
            message: 'Success',
            liked: isLiked,
            likesCount: updatedEntity.likesCount
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' })
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

//comments endpoint
export const postComments = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { content } = req.body;
        const postId = req.params.postId;

        if (!userId || !postId || !content) {
            return res.status(400).json("Missing required fields");
        }
        // check if posts exists
        const post = await prisma.post.findUnique(
            { where: { id: postId } }
        )

        if (!post) return res.status(404).json("post not found")

        const newComment = await prisma.$transaction(async (tx) => {
            const comment = await tx.comment.create({
                data: {
                    content,
                    authorId: userId,
                    postId: postId

                },
                include: {
                    author: {
                        select: { id: true, username: true, avatar: true }
                    }
                }
            }

            )
            await tx.post.update({
                where: { id: postId },
                data: { commentsCount: { increment: 1 } }
            })
            return comment;
        });

        broadcastPostUpdate(postId, {
            type: 'newComment',
            postId: postId,
            comment: {
                id: newComment.id,
                content: newComment.content,
                createdAt: newComment.createdAt.toISOString(),
            },
            author: {
                username: newComment.author.username,
                avatar: newComment.author.avatar
            },
            commentsCount: post.commentsCount + 1
        })

        return res.status(201).json(newComment)
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal server error")
    }
}

export const commentView = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = req.user?.id;

        if (!commentId || !userId) {
            return res.status(400).json({ error: 'commentId and userId are required' })
        }

        // Check if comment exists
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        })

        if (!comment) {
            return res.status(404).json({ error: 'comment not found' })
        }

        // Check existing view
        const existingView = await prisma.view.findFirst({
            where: {
                commentId: commentId,
                userId: userId
            }
        });

        let updatedComment;
        let isViewed = false;

        if (!existingView) {
            // Create new view and increment counter
            updatedComment = await prisma.$transaction(async (tx) => {
                await tx.view.create({
                    data: {
                        commentId: commentId,
                        userId: userId
                    }
                });

                return await tx.comment.update({
                    where: { id: commentId },
                    data: { viewsCount: { increment: 1 } },
                    include: { View: { select: { userId: true } } }
                });
            });
            isViewed = true;
        } else {
            // Fetch current comment data
            updatedComment = await prisma.comment.findUnique({
                where: { id: commentId },
                include: { View: { select: { userId: true } } }
            });
        }

        if (updatedComment) {
            broadcastPostUpdate(commentId, {
                type: 'viewUpdate',
                commentId,
                viewsCount: updatedComment.viewsCount,
                userId,
                isViewed,
                viewedBy: updatedComment.View.map(v => v.userId)
            });
        }

        return res.json({
            viewsCount: updatedComment?.viewsCount || 0,
            isViewed
        });

    } catch (error) {
        console.error('Error tracking comment view:', error);
        res.status(500).json({ error: 'Failed to track view' });
    }
}

export const commentLike = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = req.user?.id;

        if (!commentId || !userId) {
            return res.status(400).json({ error: 'commentId and userId are required' })
        }

        // Check if comment exists
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if user already liked this comment
        const existingLike = await prisma.like.findFirst({
            where: {
                commentId: commentId,
                userId: userId
            }
        });

        let updatedComment;
        let isLiked = false;

        if (existingLike) {
            // Unlike - delete like and decrement counter
            updatedComment = await prisma.$transaction(async (tx) => {
                await tx.like.delete({
                    where: { id: existingLike.id }
                });

                return await tx.comment.update({
                    where: { id: commentId },
                    data: { likesCount: { decrement: 1 } },
                    include: { likes: { select: { userId: true } } }
                });
            });
            isLiked = false;
        } else {
            // Like - create like and increment counter
            updatedComment = await prisma.$transaction(async (tx) => {
                await tx.like.create({
                    data: {
                        commentId: commentId,
                        userId: userId
                    }
                });

                return await tx.comment.update({
                    where: { id: commentId },
                    data: { likesCount: { increment: 1 } },
                    include: { likes: { select: { userId: true } } }
                });
            });
            isLiked = true;
        }

        // Broadcast SSE event
        broadcastPostUpdate(commentId, {
            type: 'likeUpdate',
            commentId,
            likesCount: updatedComment.likesCount,
            userId,
            isLiked,
            likedBy: updatedComment.likes.map(l => l.userId)
        });

        res.json({
            likesCount: updatedComment.likesCount,
            isLiked
        });
    } catch (error) {
        console.error('Error toggling comment like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
}

// get all teh comments of the specific post
export const getComments = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId
        const userId = req.user?.id; // Get authenticated user if available

        if (!postId) {
            return res.status(404).json("post not found")
        }
        const comments = await prisma.comment.findMany({
            where: {
                postId: postId
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                createdAt: true,
                content: true,
                likesCount: true,
                updatedAt: true,
                media: true,
                viewsCount: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                likes: {
                    select: {
                        userId: true
                    }
                },
                View: {
                    select: {
                        userId: true
                    }
                }

            }
        })
        const commentsWithCounts = comments.map(comment => ({
            ...comment,
            likesCount: comment.likes.length,
            viewsCount: comment.View.length,
            commentsCount: 0, // Comments don't have nested comments (yet)
        }))
        res.status(200).json(commentsWithCounts)

    } catch (error) {
        console.error(error);
    }
}



