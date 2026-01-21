import { prisma } from "@/config";
import { Request, Response } from 'express'


//get conversation Messages
export const getMessages = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        //verify user is part of the conversation 
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                participants: {
                    some: { id: userId }
                }
            }
        });
        if (!conversation) {
            return res.status(404).json({ error: 'conversation not found' })
        }

        //get messages with pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit

        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        const total = await prisma.message.count({
            where: { conversationId }
        })
        res.status(200).json({
            messages: messages.reverse() //reverse to show oldest first
        })
    } catch (error) {
        console.error('error fetching messages : ', error);
        res.status(500).json({ error: 'failed to fetch messages' })
    }
}

// get user conversation (HTTP endpoint) -list of all chats
export const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'unauthorized' })
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: userId }
                }
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: {
                        sender: {
                            select: {
                                id: true,
                                username: true,
                            }
                        }
                    }
                },
            },
            orderBy: { lastVibeAt: 'desc' }
        });
        res.status(200).json({ conversations })
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'failed to fetch conversations' })
    }
}

// create/get convo
export const createConversation = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { participantId } = req.body

        if (!userId) {
            return res.status(401).json({ error: 'unauthorized' })
        }

        //check if conversation already exists
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: userId } } },
                    { participants: { some: { id: participantId } } }
                ]
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        });
        if (existingConversation) {
            return res.status(200).json({ conversation: existingConversation })
        }

        //create new conversation
        const conversation = await prisma.conversation.create({
            data: {
                participants: {
                    connect: [
                        { id: userId },
                        { id: participantId }
                    ]
                }
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        })
        res.status(201).json({ conversation })

    } catch (error) {
        console.error('error creating conversation',error);
        res.status(500).json({error:'failed to create conversation'})
    }
}