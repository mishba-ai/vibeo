import { Router } from "express";
const chatRouter: Router = Router()
import { getMessages,createConversation,getConversations, } from "@/controllers/message.controller";

chatRouter.get('/conversations',getConversations)
chatRouter.get('/conversations/:conversationId',getConversations) 
chatRouter.post('/conversations',createConversation)
chatRouter.get('/conversations/:conversationId/messages',getMessages)


export {chatRouter}