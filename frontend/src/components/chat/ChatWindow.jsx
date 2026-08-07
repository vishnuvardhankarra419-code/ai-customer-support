import { useEffect, useRef } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatBubble from './ChatBubble'
import TypingIndicator from './TypingIndicator'

export default function ChatWindow() {
  const { messages, isLoading, currentSessionId } = useChat()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="h-full min-h-[50vh] flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-20 h-20 bg-brand-500/10 text-brand-400 rounded-3xl flex items-center justify-center mb-6 glow-brand">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
            <p className="text-dark-400 max-w-md">
              Ask me about your account, billing, orders, or any other issues you're facing.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-center text-xs font-medium text-dark-500 my-6 tracking-widest uppercase">
              {currentSessionId ? `Session Started` : 'New Session'}
            </div>
            
            {messages.map((msg, idx) => (
              <ChatBubble key={msg.id || idx} message={msg} />
            ))}
            
            {isLoading && <TypingIndicator />}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>
    </div>
  )
}
