// API endpoints configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Resume endpoints
  SAVE_RESUME: `${API_BASE_URL}/resume/save`,
  GET_RESUMES: `${API_BASE_URL}/resume/list`,
  UPDATE_RESUME: `${API_BASE_URL}/resume/update`,
  DELETE_RESUME: `${API_BASE_URL}/resume/delete`,
  
  // AI endpoints
  AI_IMPROVE: `${API_BASE_URL}/ai/improve`,
  AI_OPTIMIZE: `${API_BASE_URL}/ai/optimize`,
  AI_KEYWORDS: `${API_BASE_URL}/ai/keywords`,
}

export default API_ENDPOINTS
