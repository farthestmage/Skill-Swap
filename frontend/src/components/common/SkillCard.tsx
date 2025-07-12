import React from 'react';
import { MapPin, User } from 'lucide-react';
import { Skill } from '../../types';
import { Button } from './Button';
import { Rating } from './Rating';

interface SkillCardProps {
  skill: Skill;
  onViewDetails: (skill: Skill) => void;
  onRequestSwap?: (skill: Skill) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  onViewDetails,
  onRequestSwap
}) => {
  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{skill.name}</h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{skill.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <span className="bg-gray-700 px-2 py-1 rounded-md">{skill.category}</span>
            <span className={`font-medium ${getProficiencyColor(skill.proficiency)}`}>
              {skill.proficiency}
            </span>
          </div>
        </div>
      </div>

      {skill.user && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-900 rounded-lg">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {skill.user.profilePhoto ? (
              <img 
                src={skill.user.profilePhoto} 
                alt={skill.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">{skill.user.name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {skill.user.location && (
                <>
                  <MapPin className="h-3 w-3" />
                  <span>{skill.user.location}</span>
                </>
              )}
            </div>
            <Rating rating={skill.user.rating} totalRatings={skill.user.totalRatings} size="sm" />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(skill)}
          className="flex-1"
        >
          View Details
        </Button>
        {onRequestSwap && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRequestSwap(skill)}
            className="flex-1"
          >
            Request Swap
          </Button>
        )}
      </div>
    </div>
  );
};