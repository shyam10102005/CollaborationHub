const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('collaborationos_token');
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me'),

  // Creators
  getCreators: (params = '') => apiRequest(`/creators?${params}`),
  getCreator: (id) => apiRequest(`/creators/${id}`),
  updateCreator: (id, data) => apiRequest(`/creators/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getCreatorStats: (id) => apiRequest(`/creators/${id}/stats`),

  // Collaborations
  getCollaborations: (params = '') => apiRequest(`/collaborations?${params}`),
  createCollaboration: (data) => apiRequest('/collaborations', { method: 'POST', body: JSON.stringify(data) }),
  updateCollabStatus: (id, status) => apiRequest(`/collaborations/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getCollabStats: () => apiRequest('/collaborations/stats/summary'),

  // Earnings
  getEarnings: (params = '') => apiRequest(`/earnings?${params}`),
  getEarningsSummary: () => apiRequest('/earnings/summary'),
  addEarning: (data) => apiRequest('/earnings', { method: 'POST', body: JSON.stringify(data) }),

  // Content
  getContent: (params = '') => apiRequest(`/content?${params}`),
  createContent: (data) => apiRequest('/content', { method: 'POST', body: JSON.stringify(data) }),
  updateContent: (id, data) => apiRequest(`/content/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteContent: (id) => apiRequest(`/content/${id}`, { method: 'DELETE' }),
  getContentStats: () => apiRequest('/content/stats/summary'),

  // Chat
  getConversations: () => apiRequest('/chat/conversations'),
  createConversation: (participantId) => apiRequest('/chat/conversations', { method: 'POST', body: JSON.stringify({ participant_id: participantId }) }),
  getMessages: (convId) => apiRequest(`/chat/conversations/${convId}/messages`),
  sendMessage: (convId, content) => apiRequest(`/chat/conversations/${convId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),

  // Media Kit
  getMediaKit: () => apiRequest('/mediakit'),
  updateMediaKit: (data) => apiRequest('/mediakit', { method: 'PUT', body: JSON.stringify(data) }),

  // AI
  aiGenerate: (data) => apiRequest('/ai/generate', { method: 'POST', body: JSON.stringify(data) }),
  aiHashtags: (data) => apiRequest('/ai/hashtags', { method: 'POST', body: JSON.stringify(data) }),
  aiCollabSuggestions: (data) => apiRequest('/ai/collab-suggestions', { method: 'POST', body: JSON.stringify(data) }),
  aiGrowthInsights: () => apiRequest('/ai/growth-insights', { method: 'POST', body: JSON.stringify({}) }),

  // Bio Links
  getBioLinks: () => apiRequest('/biolinks'),
  createBioLink: (data) => apiRequest('/biolinks', { method: 'POST', body: JSON.stringify(data) }),
  updateBioLink: (id, data) => apiRequest(`/biolinks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBioLink: (id) => apiRequest(`/biolinks/${id}`, { method: 'DELETE' }),
  getBioAnalytics: () => apiRequest('/biolinks/analytics/summary'),
};

export default api;
