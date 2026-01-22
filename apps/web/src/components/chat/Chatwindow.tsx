import { useNavigate, useParams } from "react-router"
import type { Conversation, Message, WebSocketClientMessage, WebSocketServerEvent } from "@/types"
import React, { useEffect, useState, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import api from "@/api/axiosInstance"
import { ArrowLeftIcon, ImageIcon, SendIcon } from "lucide-react"

export default function Chatwindow() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  //stats
  const [messages, setMessages] = useState<Message[]>([])
  const [Conversation, setConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessages] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  //Refs
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const otherParticipant = React.useMemo(() => {
    return Conversation?.participants.find(p => p.id !== user?.id);
  }, [Conversation, user?.id]);

  // Fetch conversation details
  useEffect(() => {
    setMessages([]); // Reset messages immediately on ID change
    fetchConversation()
  }, [conversationId])

  // Fetch messages when conversation is loaded
  useEffect(() => {
    if (Conversation) {
      fetchMessage()
    }
  }, [Conversation])


  //connect to websocket
  useEffect(() => {
    if (!user?.id || !conversationId) return;

    const ws = new WebSocket(`ws://localhost:3000?userId=${user?.id}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('websocket connected');
    }

    ws.onmessage = (event) => {
      try {
        const data: WebSocketServerEvent = JSON.parse(event.data)
        handleWebSocketMessage(data)
      } catch (error) {
        console.error(error);
      }
    }
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }
    return () => {
      // / Only close if the connection was actually established
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    }
  }, [user?.id, conversationId])

  //auto scroll to bottom when new messges arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversation = async () => { //
    if (!conversationId) return;
    setLoading(true)
    try {
      const response = await api.get(`/api/v1/chat/conversations/${conversationId}`)
      setConversation(response.data.conversation)
    } catch (error) {
      console.error('error fetching conversation:', error);
      navigate('/chat')
    } finally {
      setLoading(false)
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
 
  const handleWebSocketMessage = (event: WebSocketServerEvent) => {
    switch (event.type) {
      case 'connection_established':
        console.log('connected as user', event.userId);
        break
      case 'new_message':
        if (String(event.message.conversationId) === String(conversationId)) {
          setMessages(prev => {
            // Prevent duplicate messages if the server sends it twice
            if (prev.find(m => m.id === event.message.id)) return prev;
            return [...prev, event.message];
          });

          //mark as read if from other user
          if (event.message.senderId !== user?.id) {
            markAsRead(event.message.id)
          }
        }
        break
      case 'user_typing':
        // console.log('typing...', event.userId);
        break
      case 'message_read':
        //update message read status
        setMessages(prev =>
          prev.map(msg => msg.id == event.messageId ? { ...msg, isRead: true } : msg
          )
        )
        break
      case 'error':
        console.error('websocket error', event.message);
    }
  }
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversationId || !wsRef.current || sending) return
    setSending(true)
    try {
      const payload: WebSocketClientMessage = {
        type: 'send_message',
        conversationId,
        message: newMessage.trim(),
        media: []
      }
      wsRef.current.send(JSON.stringify(payload))

      //clear input
      setNewMessages('')
    } catch (error) {
      console.error('error sending message ', error);
    }
    finally {
      setSending(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    if (!wsRef.current || !conversationId) return
    try {
      const payload: WebSocketClientMessage = {
        type: 'read_message',
        conversationId,
        messageId
      }
      wsRef.current.send(JSON.stringify(payload))
    } catch (error) {
      console.error('error marking message as read', error);
    }
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading conversation...</div>
      </div>
    )
  }

  if (!Conversation) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Conversation not found</div>
      </div>
    );
  }

  // 3. Handle the edge case where a conversation exists but has no other participant
  if (!otherParticipant) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Participant info missing</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* header */}
      <div className="flex items-center gap-4 p-4 border-b bg-white shadow-sm">
        <button
          onClick={() => navigate('/chat')}
          className="hover:bg-gray-100 p-2 rounded-full transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <img
          src={otherParticipant.avatar || '/default-avatar.png'}
          alt={otherParticipant.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{otherParticipant.username}</h2>
          <p className="text-xs text-gray-500">Active now</p>
        </div>
      </div>
      {/* messages container */}

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p>no messages yet</p>
              <p>start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const msgSenderId = msg.senderId || msg.sender?.id;
              const isOwnMessage = String(msgSenderId) === String(user?.id);
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {!isOwnMessage && (
                    <img
                      src={msg.sender.avatar || '/default-avatar.png'}
                      alt={msg.sender.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  {/* Message Bubble */}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isOwnMessage
                      ? 'bg-purple-500 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                  >
                    <p className="text-sm break-words">{msg.text}</p>

                    {/* Media */}
                    {msg.media && msg.media.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.media.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt="attachment"
                            className="rounded-lg max-w-full"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className={`text-xs ${isOwnMessage ? 'text-purple-200' : 'text-gray-400'
                        }`}>
                        {formatTime(msg.createdAt)}
                      </span>
                      {isOwnMessage && (
                        <span className="text-xs text-purple-200">
                          {msg.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={sendMessage}
        className="p-4 bg-white border-t"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ImageIcon className="w-5 h-5 text-gray-500" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessages(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500 transition"
            disabled={sending}
          />

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>

  )
}