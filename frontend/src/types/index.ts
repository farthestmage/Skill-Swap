// Database-aligned interfaces (exact match with schema)
export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  created_at: string;
}

export interface UserProfile {
  user_id: number;
  profile_picture?: string;
  bio?: string;
  location?: string;
  availability: 'WEEKDAYS' | 'WEEKEND' | 'BOTH';
  is_visible: boolean;
  skills_offered: number[];
  skills_wanted: number[];
}

export interface Skill {
  id: number;
  name: string;
}

export interface UserRequest {
  id: number;
  user_id: number;
  offered_skills: number[];
  wanted_skills: number[];
  message?: string;
  created_at: string;
}

export interface PersonalRequest {
  id: number;
  sender_user_id: number;
  receiver_user_id: number;
  offered_skills: number[];
  wanted_skills: number[];
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
}

export interface Review {
  id: number;
  reviewer_user_id: number;
  reviewed_user_id: number;
  rating: number;
  message?: string;
  request_id?: number;
  request_type?: 'COMMON' | 'PERSONAL';
  created_at: string;
}

export interface Report {
  id: number;
  reporter_user_id: number;
  reported_user_id?: number;
  reported_request_id?: number;
  reported_request_type?: 'COMMON' | 'PERSONAL';
  reason?: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  created_at: string;
}

export interface BannedUser {
  user_id: number;
  reason?: string;
  banned_at: string;
}

// Combined interfaces for frontend display
export interface UserWithProfile extends User {
  profile?: UserProfile;
  skills_offered_details?: Skill[];
  skills_wanted_details?: Skill[];
  rating?: number;
  total_ratings?: number;
}