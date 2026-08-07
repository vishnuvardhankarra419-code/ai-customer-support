import { useEffect } from 'react'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { useAnalytics } from '../../hooks/useAnalytics'
import Loader from '../../components/common/Loader'
import { FiCheck, FiX, FiShield } from 'react-icons/fi'

export default function UsersPage() {
  const { users, isLoading, fetchDashboardData, updateUserRole, toggleUserStatus } = useAnalytics()

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
            <h1 className="text-3xl font-bold mb-8">User Management</h1>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="table-container">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="table-header">Name</th>
                      <th className="table-header">Email</th>
                      <th className="table-header">Role</th>
                      <th className="table-header">Status</th>
                      <th className="table-header text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="table-cell font-medium text-white">{user.name}</td>
                        <td className="table-cell text-dark-300">{user.email}</td>
                        <td className="table-cell">
                          <span className={`badge ${user.role.name === 'ROLE_ADMIN' ? 'bg-accent-purple/20 text-accent-purple' : 'bg-dark-700 text-dark-200'}`}>
                            {user.role.name === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className={`badge ${user.enabled ? 'bg-accent-teal/20 text-accent-teal' : 'bg-accent-rose/20 text-accent-rose'}`}>
                            {user.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="table-cell text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`p-2 rounded-lg transition-colors ${user.enabled ? 'text-accent-rose hover:bg-accent-rose/20' : 'text-accent-teal hover:bg-accent-teal/20'}`}
                              title={user.enabled ? 'Disable User' : 'Enable User'}
                            >
                              {user.enabled ? <FiX /> : <FiCheck />}
                            </button>
                            <button
                              onClick={() => updateUserRole(user.id, user.role.name === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN')}
                              className="p-2 text-brand-400 hover:bg-brand-500/20 rounded-lg transition-colors"
                              title="Toggle Role"
                            >
                              <FiShield />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

