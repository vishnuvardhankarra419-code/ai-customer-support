import api from './api'

export const analyticsService = {
  getOverview:          ()      => api.get('/analytics/overview'),
  getMessageChart:      (days)  => api.get(`/analytics/messages/chart?days=${days}`),
  getRatingDistribution:()      => api.get('/analytics/feedback/distribution'),
  getUsers:             ()      => api.get('/admin/users'),
  updateUserRole:       (id, role) => api.put(`/admin/users/${id}/role?roleName=${role}`),
  toggleUser:           (id)    => api.put(`/admin/users/${id}/toggle`),
  deleteUser:           (id)    => api.delete(`/admin/users/${id}`),
}
