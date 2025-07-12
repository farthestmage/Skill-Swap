import { User, Skill, SwapRequest } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    location: 'San Francisco, CA',
    profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    isPublic: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    rating: 4.8,
    totalRatings: 15
  },
  {
    id: '2',
    name: 'Bob Chen',
    email: 'bob@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    isPublic: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    rating: 4.9,
    totalRatings: 23
  },
  {
    id: '3',
    name: 'Carol Martinez',
    email: 'carol@example.com',
    location: 'Austin, TX',
    profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    isPublic: true,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-08T09:15:00Z',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    rating: 4.7,
    totalRatings: 18
  }
];

export const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'React Development',
    description: 'Build modern web applications with React, including hooks, context, and best practices.',
    category: 'Programming',
    proficiency: 'Advanced',
    userId: '1',
    user: mockUsers[0]
  },
  {
    id: '2',
    name: 'Guitar Playing',
    description: 'Learn acoustic and electric guitar, from basic chords to advanced techniques.',
    category: 'Music',
    proficiency: 'Intermediate',
    userId: '2',
    user: mockUsers[1]
  },
  {
    id: '3',
    name: 'Spanish Language',
    description: 'Conversational Spanish for beginners, focusing on practical everyday communication.',
    category: 'Languages',
    proficiency: 'Advanced',
    userId: '3',
    user: mockUsers[2]
  },
  {
    id: '4',
    name: 'Digital Photography',
    description: 'Master composition, lighting, and post-processing techniques for stunning photos.',
    category: 'Creative',
    proficiency: 'Intermediate',
    userId: '1',
    user: mockUsers[0]
  },
  {
    id: '5',
    name: 'Data Science',
    description: 'Python, machine learning, and data visualization for beginners.',
    category: 'Programming',
    proficiency: 'Advanced',
    userId: '2',
    user: mockUsers[1]
  },
  {
    id: '6',
    name: 'Cooking Italian',
    description: 'Traditional Italian recipes and cooking techniques from pasta to pizza.',
    category: 'Cooking',
    proficiency: 'Intermediate',
    userId: '3',
    user: mockUsers[2]
  }
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    status: 'Pending',
    message: 'Hi! I\'d love to learn React in exchange for teaching you guitar basics.',
    skillOffered: 'Guitar Playing',
    skillWanted: 'React Development',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    senderId: '2',
    receiverId: '1',
    sender: mockUsers[1],
    receiver: mockUsers[0]
  },
  {
    id: '2',
    status: 'Accepted',
    message: 'I can teach you Spanish if you help me with photography techniques.',
    skillOffered: 'Spanish Language',
    skillWanted: 'Digital Photography',
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-19T09:15:00Z',
    senderId: '3',
    receiverId: '1',
    sender: mockUsers[2],
    receiver: mockUsers[0]
  }
];

export const skillCategories = [
  'All Categories',
  'Programming',
  'Languages',
  'Music',
  'Creative',
  'Cooking',
  'Sports',
  'Business',
  'Arts & Crafts'
];

export const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced'];
export const priorityLevels = ['High', 'Medium', 'Low'];
export const swapStatuses = ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'];