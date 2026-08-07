import api from './api'

export const feedbackService = {
  submit:          (data) => api.post('/feedback', data),
  getAll:          ()     => api.get('/feedback'),
  getAverageRating:()     => api.get('/feedback/average-rating'),
}
