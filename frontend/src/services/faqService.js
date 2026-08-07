import api from './api'

export const faqService = {
  getActiveFaqs: ()        => api.get('/faq'),
  getAllFaqs:     ()        => api.get('/faq/all'),
  createFaq:     (data)    => api.post('/faq', data),
  updateFaq:     (id, data)=> api.put(`/faq/${id}`, data),
  deleteFaq:     (id)      => api.delete(`/faq/${id}`),
}
