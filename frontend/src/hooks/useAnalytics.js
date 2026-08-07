import { useState, useCallback } from 'react'
import { analyticsService } from '../services/analyticsService'
import toast from 'react-hot-toast'

export const useAnalytics = () => {
  const [overview, setOverview] = useState(null)
  const [chartData, setChartData] = useState([])
  const [distribution, setDistribution] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [overviewRes, chartRes, distRes, usersRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getMessageChart(30),
        analyticsService.getRatingDistribution(),
        analyticsService.getUsers()
      ])
      setOverview(overviewRes.data)
      setChartData(chartRes.data)
      setDistribution(distRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateUserRole = async (id, role) => {
    try {
      await analyticsService.updateUserRole(id, role)
      toast.success('Role updated')
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: { name: role } } : u))
    } catch (err) {
      toast.error('Failed to update role')
    }
  }

  const toggleUserStatus = async (id) => {
    try {
      const res = await analyticsService.toggleUser(id)
      toast.success('User status updated')
      setUsers(prev => prev.map(u => u.id === id ? res.data : u))
    } catch (err) {
      toast.error('Failed to update user status')
    }
  }

  const deleteUser = async (id) => {
    try {
      await analyticsService.deleteUser(id)
      toast.success('User deleted')
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      toast.error('Failed to delete user')
    }
  }

  return {
    overview,
    chartData,
    distribution,
    users,
    isLoading,
    fetchDashboardData,
    updateUserRole,
    toggleUserStatus,
    deleteUser
  }
}
