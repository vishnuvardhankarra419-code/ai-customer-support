import { FiMenu, FiX, FiMessageSquare } from 'react-icons/fi'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <nav className="h-16 border-b border-white/10 bg-dark-950/80 backdrop-blur-md sticky top-0 z-40 md:hidden flex items-center justify-between px-4">
      <div className="flex items-center gap-2 text-brand-400">
        <FiMessageSquare size={20} className="glow-brand" />
        <span className="font-bold text-white">AI Support</span>
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="text-white">
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-dark-900 border-b border-white/10 shadow-2xl p-4 flex flex-col gap-4 z-50">
          <Link to="/chat" className="text-white font-medium px-4 py-2 hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}>Chat</Link>
          <Link to="/feedback" className="text-white font-medium px-4 py-2 hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}>Feedback</Link>
          {user?.role === 'ROLE_ADMIN' && (
            <Link to="/admin" className="text-brand-400 font-medium px-4 py-2 hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}>Admin Panel</Link>
          )}
          <button onClick={() => { logout(); setIsOpen(false) }} className="text-accent-rose font-medium text-left px-4 py-2 hover:bg-white/5 rounded-lg">
            Sign Out
          </button>
        </div>
      )}
    </nav>
  )
}
