import { FiMonitor } from 'react-icons/fi'

export default function TypingIndicator() {
  return (
    <div className="flex w-full justify-start mb-6 animate-fade-in">
      <div className="flex max-w-[85%] lg:max-w-[75%] gap-4 flex-row">
        
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 border border-white/20">
          <FiMonitor size={20} className="text-brand-400" />
        </div>

        {/* Bubble */}
        <div className="px-5 py-4 bubble-ai flex items-center gap-1.5 h-[52px]">
          <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce-dots"></div>
          <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce-dots animate-delay-100"></div>
          <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce-dots animate-delay-200"></div>
        </div>

      </div>
    </div>
  )
}
