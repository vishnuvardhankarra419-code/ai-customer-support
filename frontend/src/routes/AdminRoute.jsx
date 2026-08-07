import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

export default function AdminRoute() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  
  if (!user) return <Navigate to="/login" replace />
  
  if (!isAdmin()) {
    toast.error('Admin access required')
    return <Navigate to="/chat" replace />
  }

  return <Outlet />
}
