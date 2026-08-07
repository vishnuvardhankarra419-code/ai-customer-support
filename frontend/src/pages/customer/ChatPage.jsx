import { useEffect } from 'react'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import ChatHistory from '../../components/chat/ChatHistory'
import ChatWindow from '../../components/chat/ChatWindow'
import ChatInput from '../../components/chat/ChatInput'
import { useChat } from '../../hooks/useChat'

export default function ChatPage() {
  const { fetchSessions } = useChat()

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        
        <div className="flex flex-1 overflow-hidden relative">
          <ChatHistory />
          
          <div className="flex flex-col flex-1 relative bg-gradient-to-b from-dark-950 to-dark-900">
            <ChatWindow />
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  )
}

