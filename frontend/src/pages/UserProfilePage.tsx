import React, { useState } from 'react';
import { Edit, Plus, MapPin, Calendar, Star, User as UserIcon } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Rating } from '../components/common/Rating';
import { mockUsers, mockSkills } from '../data/mockData';

export const UserProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = mockUsers[0]; // Mock current user
  const userSkills = mockSkills.filter(skill => skill.userId === user.id);

  const skillsWanted = [
    { id: '1', name: 'Data Science', category: 'Programming', priority: 'High' },
    { id: '2', name: 'Italian Cooking', category: 'Cooking', priority: 'Medium' },
    { id: '3', name: 'Piano Playing', category: 'Music', priority: 'Low' }
  ];

  const availability = [
    { day: 'Monday', timeSlot: 'Evening' },
    { day: 'Wednesday', timeSlot: 'Evening' },
    { day: 'Saturday', timeSlot: 'Morning' },
    { day: 'Sunday', timeSlot: 'Afternoon' }
  ];

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center relative">
                {user.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-16 w-16 text-gray-400" />
                )}
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Edit className="h-4 w-4 text-black" />
                </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                  {user.location && (
                    <div className="flex items-center gap-1 text-gray-400 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <Rating rating={user.rating} totalRatings={user.totalRatings} />
                </div>
                <Button
                  variant={isEditing ? 'primary' : 'outline'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Active</span>
                </div>
                <div className="text-gray-400">
                  Last seen: 2 hours ago
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Profile Visibility</h3>
                <p className="text-sm text-gray-400">Control who can see your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={user.isPublic} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                <span className="ml-3 text-sm text-gray-300">
                  {user.isPublic ? 'Public' : 'Private'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Skills I Offer</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userSkills.map(skill => (
              <div key={skill.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{skill.description}</p>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-gray-700 px-2 py-1 rounded-md text-gray-300">
                    {skill.category}
                  </span>
                  <span className={`font-medium ${
                    skill.proficiency === 'Advanced' ? 'text-red-400' :
                    skill.proficiency === 'Intermediate' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {skill.proficiency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Skills I Want to Learn</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Interest
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsWanted.map(skill => (
              <div key={skill.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                    <span className="text-sm text-gray-400">{skill.category}</span>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    skill.priority === 'High' ? 'bg-red-900 text-red-300' :
                    skill.priority === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {skill.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Availability</h2>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Schedule
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availability.map((slot, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
                <div className="text-white font-medium">{slot.day}</div>
                <div className="text-sm text-gray-400 mt-1">{slot.timeSlot}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-white font-medium">Timezone</span>
            </div>
            <p className="text-gray-400 text-sm">
              Pacific Standard Time (PST) - UTC-8
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};