import { useEffect } from 'react'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { useAnalytics } from '../../hooks/useAnalytics'
import Loader from '../../components/common/Loader'
import { FiUsers, FiMessageSquare, FiStar, FiActivity } from 'react-icons/fi'

export default function AdminDashboardPage() {
  const { overview, isLoading, fetchDashboardData } = useAnalytics()

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            {isLoading || !overview ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="stats-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-brand-500/20 text-brand-400 rounded-xl">
                      <FiUsers size={24} />
                    </div>
                    <span className="text-sm font-medium text-dark-400">Total Users</span>
                  </div>
                  <h3 className="text-3xl font-bold">{overview.totalUsers}</h3>
                </div>

                <div className="stats-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-accent-teal/20 text-accent-teal rounded-xl">
                      <FiMessageSquare size={24} />
                    </div>
                    <span className="text-sm font-medium text-dark-400">Total Sessions</span>
                  </div>
                  <h3 className="text-3xl font-bold">{overview.totalSessions}</h3>
                </div>

                <div className="stats-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-accent-amber/20 text-accent-amber rounded-xl">
                      <FiStar size={24} />
                    </div>
                    <span className="text-sm font-medium text-dark-400">Avg Rating</span>
                  </div>
                  <h3 className="text-3xl font-bold">{overview.averageRating} <span className="text-lg text-dark-400">/ 5</span></h3>
                </div>

                <div className="stats-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-accent-purple/20 text-accent-purple rounded-xl">
                      <FiActivity size={24} />
                    </div>
                    <span className="text-sm font-medium text-dark-400">30d Messages</span>
                  </div>
                  <h3 className="text-3xl font-bold">{overview.messagesLast30Days}</h3>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

