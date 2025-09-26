"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Send, Clock, CheckCheck, Phone, Video, MoreVertical } from "lucide-react"

interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string
  order_id: string | null
  message: string
  message_type: "text" | "image" | "location"
  is_read: boolean
  created_at: string
  sender: {
    full_name: string
    user_type: "farmer" | "buyer"
    profile_image_url?: string
  }
}

interface ChatConversation {
  id: string
  participant: {
    id: string
    full_name: string
    user_type: "farmer" | "buyer"
    profile_image_url?: string
  }
  lastMessage: {
    message: string
    created_at: string
    is_read: boolean
    sender_id: string
  }
  unreadCount: number
  order?: {
    id: string
    product: {
      name: string
    }
  }
}

export function ChatInterface() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()
        setCurrentUser(userProfile)

        // Fetch conversations
        await fetchConversations(user.id)
      } catch (error) {
        console.error("Error initializing chat:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeChat()
  }, [supabase])

  const fetchConversations = async (userId: string) => {
    try {
      // Get all messages where user is sender or receiver
      const { data: messagesData } = await supabase
        .from("chat_messages")
        .select(
          `
          *,
          sender:users!chat_messages_sender_id_fkey(id, full_name, user_type, profile_image_url),
          receiver:users!chat_messages_receiver_id_fkey(id, full_name, user_type, profile_image_url),
          order:orders(
            id,
            product:products(name)
          )
        `,
        )
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false })

      // Group messages by conversation (other participant)
      const conversationMap = new Map<string, ChatConversation>()

      messagesData?.forEach((message) => {
        const otherParticipant = message.sender_id === userId ? message.receiver : message.sender
        const conversationId = otherParticipant.id

        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            participant: otherParticipant,
            lastMessage: {
              message: message.message,
              created_at: message.created_at,
              is_read: message.is_read,
              sender_id: message.sender_id,
            },
            unreadCount: 0,
            order: message.order,
          })
        }

        // Count unread messages
        if (!message.is_read && message.receiver_id === userId) {
          const conversation = conversationMap.get(conversationId)!
          conversation.unreadCount++
        }
      })

      setConversations(Array.from(conversationMap.values()))
    } catch (error) {
      console.error("Error fetching conversations:", error)
    }
  }

  const fetchMessages = async (participantId: string) => {
    try {
      const { data } = await supabase
        .from("chat_messages")
        .select(
          `
          *,
          sender:users!chat_messages_sender_id_fkey(full_name, user_type, profile_image_url)
        `,
        )
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${participantId}),and(sender_id.eq.${participantId},receiver_id.eq.${currentUser.id})`,
        )
        .order("created_at", { ascending: true })

      setMessages(data || [])

      // Mark messages as read
      await supabase
        .from("chat_messages")
        .update({ is_read: true })
        .eq("sender_id", participantId)
        .eq("receiver_id", currentUser.id)
        .eq("is_read", false)

      // Refresh conversations to update unread counts
      await fetchConversations(currentUser.id)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !currentUser) return

    try {
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: activeConversation,
        message: newMessage.trim(),
        message_type: "text",
        is_read: false,
      }

      const { error } = await supabase.from("chat_messages").insert(messageData)

      if (error) throw error

      setNewMessage("")
      await fetchMessages(activeConversation)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else {
      return date.toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!currentUser) return

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `receiver_id=eq.${currentUser.id}`,
        },
        () => {
          if (activeConversation) {
            fetchMessages(activeConversation)
          }
          fetchConversations(currentUser.id)
        },
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [currentUser, activeConversation, supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeConversation === conversation.id ? "bg-green-50 border-r-2 border-green-500" : ""
                    }`}
                    onClick={() => {
                      setActiveConversation(conversation.id)
                      fetchMessages(conversation.id)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.participant.profile_image_url || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.participant.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conversation.participant.full_name}
                          </p>
                          <div className="flex items-center space-x-1">
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-green-600 text-white text-xs">{conversation.unreadCount}</Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">{conversation.lastMessage.message}</p>
                          <Badge variant="outline" className="text-xs">
                            {conversation.participant.user_type}
                          </Badge>
                        </div>
                        {conversation.order && (
                          <p className="text-xs text-green-600 mt-1">Order: {conversation.order.product.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-2">
        {!activeConversation ? (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </CardContent>
        ) : (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        conversations.find((c) => c.id === activeConversation)?.participant.profile_image_url ||
                        "/placeholder.svg"
                      }
                    />
                    <AvatarFallback>
                      {conversations
                        .find((c) => c.id === activeConversation)
                        ?.participant.full_name.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {conversations.find((c) => c.id === activeConversation)?.participant.full_name}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {conversations.find((c) => c.id === activeConversation)?.participant.user_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === currentUser?.id
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <div
                          className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.sender_id === currentUser?.id ? "text-green-100" : "text-gray-500"
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{formatTime(message.created_at)}</span>
                          {message.sender_id === currentUser?.id && (
                            <CheckCheck className={`h-3 w-3 ${message.is_read ? "text-blue-200" : ""}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              {/* Message Input */}
              <div className="p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        sendMessage()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
