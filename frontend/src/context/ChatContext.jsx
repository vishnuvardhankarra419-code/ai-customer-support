import { createContext, useContext, useState, useCallback } from 'react'
import { chatService } from '../services/chatService'
import toast from 'react-hot-toast'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSessions = useCallback(async () => {
    try {
      const res = await chatService.getSessions()
      setSessions(res.data)
    } catch (err) {
      toast.error('Failed to load chat sessions')
    }
  }, [])

  const fetchMessages = useCallback(async (sessionId) => {
    try {
      setIsLoading(true)
      const res = await chatService.getMessages(sessionId)
      setMessages(res.data)
      setCurrentSessionId(sessionId)
    } catch (err) {
      toast.error('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendMessage = async (content) => {
    try {
      setIsLoading(true)
      
      // Optimistically add user message
      const tempUserMsg = {
        id: Date.now(),
        sender: 'USER',
        content,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, tempUserMsg])

      const res = await chatService.sendMessage({
        message: content,
        sessionId: currentSessionId
      })
      
      const newSessionId = res.data.sessionId
      if (!currentSessionId && newSessionId) {
        setCurrentSessionId(newSessionId)
        await fetchSessions() // refresh session list
      }
      
      setMessages(prev => [...prev, res.data])
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to send message'
      toast.error(errorMsg)
      // Remove optimistic message on failure
      setMessages(prev => prev.slice(0, -1))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const startNewChat = () => {
    setCurrentSessionId(null)
    setMessages([])
  }

  return (
    <ChatContext.Provider value={{
      sessions,
      currentSessionId,
      messages,
      isLoading,
      fetchSessions,
      fetchMessages,
      sendMessage,
      startNewChat
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChatContext must be used within ChatProvider')
  return context
}
