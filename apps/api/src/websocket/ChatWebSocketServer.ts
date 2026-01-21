import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { prisma } from '@/config';
import { parse } from 'url';

interface AuthenticatedWebSocket extends WebSocket {
    userId?: string;
    isAlive?: boolean
}
interface MessagePayload {
    type: 'send_message' | 'typing' | 'read_message';
    conversationId: string;
    message?: string;
    media?: string[];
    messageId?: string
}

export class ChatWebSocketServer {
    private wss: WebSocketServer;
    private clients: Map<string, AuthenticatedWebSocket> = new Map();

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.initialize()
    }

    private initialize() {
        // to detect broken connections
        const interval = setInterval(() => {
            this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
                if (ws.isAlive === false) {
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping()
            })
        }, 30000);

        this.wss.on('close', () => {
            clearInterval(interval)
        })
        this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
            this.handleConnection(ws, req)
        })
    }

    private async handleConnection(ws: AuthenticatedWebSocket, req: any) {
        // Extract userId from query params or JWT token
        const { query } = parse(req.url || '', true);
        const userId = query.userId as string; // In production, verify JWT token
        if (!userId) {
            ws.close(1008, 'Unauthorized');
            return;
        }

        //setup client
        ws.userId = userId
        ws.isAlive = true
        this.clients.set(userId, ws)

        console.log(`User ${userId} connected. Total clients: ${this.clients.size}`);

        // send welcome message 
        ws.send(JSON.stringify({
            type: 'connection_established',
            userId,
            timeStamp: new Date()
        }))

        //handle Pong responses
        ws.on('pong', () => {
            ws.isAlive = true;
        })

        //handle incoming messages
        ws.on('message', async (data) => {
            try {
                const payload: MessagePayload = JSON.parse(data.toString())
                await this.handleMessage(ws, payload);
            } catch (error) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Invalid message format'
                }))
            }
        });
        ws.on('close', () => { //handle disconnection
            console.log(`User ${userId} disconnected`);
            this.clients.delete(userId)
        });
        ws.on('error', (error) => {
            console.error(`WebSocket error for user ${userId}:`, error);
        })
    }

    private async handleMessage(ws: AuthenticatedWebSocket, payload: MessagePayload) {
        const senderId = ws.userId!;
        switch (payload.type) {
            case 'send_message':
                await this.handleSendMessage(senderId, payload)
                break;
            case 'typing':
                await this.handleTyping(senderId, payload);
                break;
            case 'read_message':
                await this.handleReadMessage(senderId, payload)
                break;
            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'unknown message type'
                }));
        }
    }

    private async handleSendMessage(senderId: string, payload: MessagePayload) {
        const { conversationId, message, media } = payload
        if (!message && (!media || media.length === 0)) {
            return;
        }
        try {
            const newMessage = await prisma.message.create({
                data: {
                    text: message || '',
                    media: media || [],
                    senderId,
                    conversationId
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    }
                }
            });
            await prisma.conversation.update({
                where: { id: conversationId },
                data: { lastVibeAt: new Date() }
            });
            //get all participants in the conversation
            const conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
                include: {
                    participants: {
                        select: { id: true }
                    }
                }
            })
            if (!conversation) {
                throw new Error('conversation not found ')
            }
            //broadcast message to all particpants
            const messageData = {
                type: 'new message',
                message: {
                    id: newMessage.id,
                    text: newMessage.text,
                    media: newMessage.media,
                    conversationId: newMessage.conversationId,
                    sender: newMessage.sender,
                    createdAt: newMessage.createdAt,
                    isRead: newMessage.isRead,
                }
            };
            conversation.participants.forEach(participant => {
                const client = this.clients.get(participant.id);
                if (client && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(messageData));
                }
            });
        } catch (error) {
            console.error('error sending message ', error);
            const senderClient = this.clients.get(senderId);
            if (senderClient) {
                senderClient.send(JSON.stringify({
                    type: 'error',
                    message: 'Failed to send message'
                }))
            }
        }
    }

    private async handleTyping(senderId: string, payload: MessagePayload) {
        //id , istyping 
        const { conversationId } = payload;
        try {
            //get conversation participant
            const conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
                include: {
                    participants: {
                        select: { id: true }
                    }
                }
            });
            if (!conversation) return;

            //notify other participants
            const typingData = {
                type: 'user_typing',
                conversationId,
                userId: senderId
            }
            conversation.participants.forEach(participant => {
                if (participant.id !== senderId) {
                    const client = this.clients.get(participant.id);
                    if (client && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(typingData));
                    }
                }
            });
        } catch (error) {
            console.error('error handling typing:', error);
        }
    }

    private async handleReadMessage(senderId: string, payload: MessagePayload) {
        const { conversationId, messageId } = payload
        if (!messageId) return;

        try {
            //mark message as read
            await prisma.message.update({
                where: { id: messageId },
                data: { isRead: true }
            })
            // Notify the sender
            const message = await prisma.message.findUnique({
                where: { id: messageId },
                select: { senderId: true }
            });

            if (message) {
                const senderClient = this.clients.get(message.senderId);
                if (senderClient && senderClient.readyState === WebSocket.OPEN) {
                    senderClient.send(JSON.stringify({
                        type: 'message_read',
                        messageId,
                        conversationId,
                        readBy: senderId
                    }));
                }
            }
        } catch (error) {
            console.error('Error marking message as read:', error);

        }
    }
    public getConnectedClients(): number {
        return this.clients.size;
    }
}