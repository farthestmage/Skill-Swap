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
  return (
    <div className="bg-gray-800 hover:shadow-lg p-6 border border-gray-700 hover:border-gray-600 rounded-lg transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="mb-2 font-semibold text-white text-xl">{skill.name}</h3>
          <p className="mb-3 text-gray-300 text-sm line-clamp-2">{skill.description}</p>
          
          <div className="flex items-center gap-4 mb-3 text-gray-400 text-sm">
            <span className="bg-gray-700 px-2 py-1 rounded-md">{skill.category}</span>
            {/* <span className={`font-medium ${getProficiencyColor(skill.proficiency)}`}>
              {skill.proficiency}
            </span> */}
          </div>
        </div>
      </div>

      {skill.user && (
        <div className="flex items-center gap-3 bg-gray-900 mb-4 p-3 rounded-lg">
          <div className="flex justify-center items-center bg-gray-700 rounded-full w-10 h-10">
            {skill.user.profilePhoto ? (
              <img 
                src={skill.user.profilePhoto} 
                alt={skill.user.name}
                className="rounded-full w-10 h-10 object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">{skill.user.name}</p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              {skill.user.location && (
                <>
                  <MapPin className="w-3 h-3" />
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