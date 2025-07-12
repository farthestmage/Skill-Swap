import React from 'react';
import { MapPin, User as UserIcon } from 'lucide-react';
import { User } from '../../types';
import { Button } from './Button';
import { Rating } from './Rating';

interface UserCardProps {
  user: User;
  onViewProfile: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onViewProfile }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
          {user.profilePhoto ? (
            <img 
              src={user.profilePhoto} 
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <UserIcon className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white">{user.name}</h3>
          {user.location && (
            <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
          <div className="mt-2">
            <Rating rating={user.rating} totalRatings={user.totalRatings} size="sm" />
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <span className="text-sm text-gray-400">Skills Offered: </span>
          <span className="text-white">{user.skillsOffered.length}</span>
        </div>
        <div>
          <span className="text-sm text-gray-400">Skills Wanted: </span>
          <span className="text-white">{user.skillsWanted.length}</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewProfile(user)}
        className="w-full"
      >
        View Profile
      </Button>
    </div>
  );
};