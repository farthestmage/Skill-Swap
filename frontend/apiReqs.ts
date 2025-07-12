import axios from 'axios';
import { User, UserProfile, UserRequest, PersonalRequest, Review } from './src/types/index.ts';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Users API
export const userAPI = {
  getAllUsers: () => api.get<User[]>('api/users'),
  getUserById: (id: number) => api.get<User>(`/users/${id}`),
  updateUser: (id: number, data: Partial<User>) => api.put(`/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

// User Profiles API
export const profileAPI = {
  getUserProfile: (userId: number) => api.get<UserProfile>(`/api/user/${userId}`),
  updateProfile: (userId: number, data: Partial<UserProfile>) => api.put(`/api/user/${userId}`, data),
  deleteProfile: (userId: number) => api.delete(`/api/user/${userId}`),
  getAllProfiles: () => api.get<UserProfile[]>('/api/user'),
};

// // Skills API
// export const skillsAPI = {
//   getAllSkills: () => api.get<Skill[]>('/skills'),
//   createSkill: (data: { name: string }) => api.post<Skill>('/skills', data),
//   updateSkill: (id: number, data: { name: string }) => api.put(`/skills/${id}`, data),
//   deleteSkill: (id: number) => api.delete(`/skills/${id}`),
// };

// User Requests API
export const userRequestsAPI = {
  getAllRequests: () => api.get<UserRequest[]>('/api/request'),
  createRequest: (data: Omit<UserRequest, 'id' | 'created_at'>) => api.post<UserRequest>('/api/request', data),
  deleteRequest: (id: number) => api.delete(`/api/request/${id}`),
  getUserRequests: (userId: number) => api.get<UserRequest[]>(`/api/request/${userId}`),
};

// Personal Requests API
export const personalRequestsAPI = {
  getAllRequests: () => api.get<PersonalRequest[]>('/api/personal'),
  createRequest: (data: Omit<PersonalRequest, 'id' | 'created_at'>) => api.post<PersonalRequest>('/api/personal', data),
  updateRequest: ( data: Partial<PersonalRequest>) => api.put(`/api/personal`, data),
  deleteRequest: (id: number) => api.delete(`/api/personal/${id}`),
  getUserRequests: (userId: number) => api.get<PersonalRequest[]>(`/api/personal/sent/${userId}`),
  getRequestsForUser: (userId: number) => api.get<PersonalRequest[]>(`/api/personal/recieved/${userId}`),
};

// Reviews API
export const reviewsAPI = {
  createReview: (data: Omit<Review, 'id' | 'created_at'>) => api.post<Review>('/api/review', data),
  deleteReview: (id: number) => api.delete(`/api/review/${id}`),
  getUserReviews: (userId: number) => api.get<Review[]>(`/api/review/given/${userId}`),
  RgetUserReviews: (userId: number) => api.get<Review[]>(`/api/review/recieved/${userId}`),
};


export default api;