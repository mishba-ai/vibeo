import { Router } from "express";
const chatRouter: Router = Router()
import { getMessages,createConversation,getConversations, getConversation } from "@/controllers/message.controller";

chatRouter.get('/conversations',getConversations)
chatRouter.post('/conversations',createConversation)
chatRouter.get('/conversations/:conversationId/messages',getMessages)
chatRouter.get('/conversations/:conversationId', getConversation);


export {chatRouter}