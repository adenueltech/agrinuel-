"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageCircle, User } from "lucide-react"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  farmerId: string
  farmerName: string
  productName: string
}

interface Message {
  id: string
  sender_id: string
  message: string
  created_at: string
  sender: {
    full_name: string
  }
}

export function ChatModal({ isOpen, onClose, farmerId, farmerName, productName }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      initializeChat()
    }
  }, [isOpen])

  const initializeChat = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()
      setCurrentUser(userProfile)

      // Fetch existing messages
      await fetchMessages(user.id)
    } catch (error) {
      console.error("Error initializing chat:", error)
    }
  }

  const fetchMessages = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("chat_messages")
        .select(
          `
          *,
          sender:users!chat_messages_sender_id_fkey(full_name)
        `,
        )
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${farmerId}),and(sender_id.eq.${farmerId},receiver_id.eq.${userId})`,
        )
        .order("created_at", { ascending: true })

      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return

    setIsLoading(true)
    try {
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: farmerId,
        message: newMessage.trim(),
        message_type: "text",
        is_read: false,
      }

      const { error } = await supabase.from("chat_messages").insert(messageData)

      if (error) throw error

      setNewMessage("")
      await fetchMessages(currentUser.id)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{farmerName}</p>
              <p className="text-sm text-gray-500">About: {productName}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 border rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Start a conversation about {productName}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender_id === currentUser?.id ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id === currentUser?.id ? "text-green-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="flex space-x-2 pt-4">
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
            disabled={!newMessage.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
