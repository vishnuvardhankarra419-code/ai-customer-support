import { FiUser, FiMonitor } from 'react-icons/fi'

export default function ChatBubble({ message }) {
  const isUser = message.sender === 'USER'

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-slide-up`}>
      <div className={`flex max-w-[85%] lg:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isUser 
            ? 'bg-brand-600 shadow-lg shadow-brand-900/40 glow-brand' 
            : 'bg-white/10 border border-white/20'
        }`}>
          {isUser ? <FiUser size={20} /> : <FiMonitor size={20} className="text-brand-400" />}
        </div>

        {/* Message Bubble */}
        <div className={`px-5 py-4 ${isUser ? 'bubble-user' : 'bubble-ai'}`}>
          <div className="prose prose-invert max-w-none text-sm">
            {(message.content || '').split('\n').map((line, i) => (
              <p key={i} className={i === 0 ? 'mt-0' : 'mt-2'}>
                {line}
              </p>
            ))}
          </div>
          <div className={`text-[10px] mt-2 ${isUser ? 'text-brand-200/70 text-right' : 'text-dark-400 text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

      </div>
    </div>
  )
}
