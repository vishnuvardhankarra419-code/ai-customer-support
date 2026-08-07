import api from './api'

export const chatService = {
  sendMessage:     (data)      => api.post('/chat/message', data),
  getSessions:     ()          => api.get('/chat/sessions'),
  getMessages:     (sessionId) => api.get(`/chat/sessions/${sessionId}/messages`),
}
