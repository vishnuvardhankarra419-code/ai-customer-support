import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { useChat } from '../../hooks/useChat'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const { sendMessage, isLoading } = useChat()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const content = message
    setMessage('')
    try {
      await sendMessage(content)
    } catch (err) {
      setMessage(content)
    }
  }

  return (
    <div className="p-4 bg-dark-900 border-t border-white/10">
      <form 
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto relative flex items-center bg-dark-800 border border-white/10 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:border-brand-500/50 transition-all"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-transparent border-none px-6 py-4 text-white placeholder-dark-400 focus:outline-none"
          disabled={isLoading}
        />
        <div className="pr-2">
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50 disabled:bg-dark-600 transition-all shadow-lg shadow-brand-900/30 hover:shadow-brand-600/40"
          >
            <FiSend className={message.trim() && !isLoading ? 'ml-0.5' : ''} />
          </button>
        </div>
      </form>
    </div>
  )
}
