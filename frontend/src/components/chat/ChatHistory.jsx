import { FiMessageSquare, FiPlus, FiClock } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { useChat } from '../../hooks/useChat'

export default function ChatHistory() {
  const { sessions, currentSessionId, fetchMessages, startNewChat } = useChat()

  return (
    <div className="w-72 bg-dark-900 border-r border-white/10 flex flex-col hidden lg:flex">
      <div className="p-4 border-b border-white/10">
        <button 
          onClick={startNewChat}
          className="w-full flex items-center justify-center gap-2 bg-brand-600/10 hover:bg-brand-600/20 text-brand-400 border border-brand-500/30 py-2.5 rounded-xl font-medium transition-all"
        >
          <FiPlus /> New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 px-2">
          Recent Conversations
        </div>
        
        {sessions.length === 0 ? (
          <div className="text-center p-4 text-dark-500 text-sm">
            No past chats found.
          </div>
        ) : (
          sessions.map(session => (
            <button
              key={session.id}
              onClick={() => fetchMessages(session.id)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                currentSessionId === session.id 
                  ? 'bg-white/10 border border-white/10' 
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <FiMessageSquare className={`mt-0.5 ${currentSessionId === session.id ? 'text-brand-400 glow-brand' : 'text-dark-400 group-hover:text-dark-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${currentSessionId === session.id ? 'text-white' : 'text-dark-200 group-hover:text-white'}`}>
                    {session.title}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-dark-500 mt-1">
                    <FiClock />
                    {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
