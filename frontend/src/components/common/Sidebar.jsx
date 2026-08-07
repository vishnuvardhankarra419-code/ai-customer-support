import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { 
  FiMessageSquare, 
  FiSettings, 
  FiUsers, 
  FiPieChart, 
  FiHelpCircle,
  FiLogOut,
  FiStar
} from 'react-icons/fi'

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: 'Chat', path: '/chat', icon: FiMessageSquare, roles: ['ROLE_USER', 'ROLE_ADMIN'] },
    { name: 'Feedback', path: '/feedback', icon: FiStar, roles: ['ROLE_USER', 'ROLE_ADMIN'] },
    { name: 'Dashboard', path: '/admin', icon: FiPieChart, roles: ['ROLE_ADMIN'] },
    { name: 'Users', path: '/admin/users', icon: FiUsers, roles: ['ROLE_ADMIN'] },
    { name: 'FAQs', path: '/admin/faqs', icon: FiHelpCircle, roles: ['ROLE_ADMIN'] },
    { name: 'All Feedback', path: '/admin/feedback', icon: FiSettings, roles: ['ROLE_ADMIN'] },
    { name: 'Analytics', path: '/admin/analytics', icon: FiPieChart, roles: ['ROLE_ADMIN'] },
  ]

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role))

  return (
    <div className="w-64 h-screen bg-dark-950 border-r border-white/10 flex flex-col hidden md:flex">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3 text-brand-400">
          <FiMessageSquare size={24} className="glow-brand" />
          <span className="font-bold text-lg text-white">AI Support</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {filteredNav.map(item => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.path) && 
                           (item.path !== '/admin' || location.pathname === '/admin')
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-dark-400 truncate">{user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-accent-rose hover:bg-accent-rose/10 rounded-xl transition-colors text-sm font-medium"
        >
          <FiLogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
