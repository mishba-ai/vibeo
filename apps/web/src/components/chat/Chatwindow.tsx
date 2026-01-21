import { Meta, useParams } from "react-router"
import type { Conversation, Message } from "@/types"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import api from "@/api/axiosInstance"
import type { WebSocketClientMessage } from '../../types/index'


export default function Chatwindow() {

  const { conversationId } = useParams<{ conversationId: string }>()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [Conversation, setConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessages] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchConversation = async () => { //
    if (!conversationId) return;
    try {
      const response = await api.get(`/api/v1/chat/conversations/${conversationId}`)
    } catch (error) {
      console.error(error);
    }

  }
  //fetch messages for this conversation
  const fetchMessage = async () => {
    if (!conversationId) return
    try {
      const response = await api.get(`api/v1/chat/conversations/${conversationId}/messages`)
      setMessages(response.data.messages)
    } catch (error) {
      console.error('error fetching messages', error);
    }
  }

  //fetch conversation details
  useEffect(() => {
    fetchConversation()
    fetchMessage()
  }, [conversationId])


  //connect to websocket
  useEffect(() => {
    if (!user?.id) return;
    const ws = new WebSocket(`ws://localhost:3000?userId=${user?.id}`)

    ws.onopen = () => {
      console.log('websocket connected');
    }

    ws.onmessage = (event) => {
      try {
        const data: WebSocketClientMessage = JSON.parse(event.data)
        handleWebSocketMessage(data)
      } catch (error) {
        console.error(error);
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
      }

      wsRef.current = ws

      return () => {
        ws.close()
      }
    }
  }, [user?.id])

  const handleWebSocketMessage = (data:WebSocketClientMessage) => {
     
  }
  const otherParticipant = Conversation?.participants.find(
    p => p.id != user?.id
  )

  return (
    <div className="w-full h-screen flex  bg-gray-200">
      {/* show the data of the whom user is sending the message  */}
      hi
      <img src={otherParticipant?.avatar!} alt="" className="rounded-full w-12 h-12" />
    </div>
  )
}