export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  skillsOffered: Skill[];
  skillsWanted: SkillWanted[];
  availability: Availability[];
  rating: number;
  totalRatings: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  userId: string;
  user?: User;
}

export interface SkillWanted {
  id: string;
  name: string;
  description?: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  userId: string;
  user?: User;
}

export interface Availability {
  id: string;
  dayOfWeek: string;
  timeSlot: string;
  userId: string;
}

export interface SwapRequest {
  id: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';
  message?: string;
  skillOffered: string;
  skillWanted: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
}

export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  giverId: string;
  receiverId: string;
  swapRequestId: string;
}