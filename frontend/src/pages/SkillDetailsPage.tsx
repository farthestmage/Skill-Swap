import React from 'react';
import { ArrowLeft, MapPin, Calendar, Star, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Rating } from '../components/common/Rating';
import { mockSkills } from '../data/mockData';

export const SkillDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const skill = mockSkills[0]; // Mock skill details

  const similarSkills = mockSkills.slice(1, 4);

  const reviews = [
    {
      id: '1',
      reviewer: 'John Doe',
      rating: 5,
      comment: 'Excellent teacher! Very patient and explains concepts clearly.',
      date: '2024-01-15'
    },
    {
      id: '2',
      reviewer: 'Jane Smith',
      rating: 4,
      comment: 'Great session, learned a lot about React hooks.',
      date: '2024-01-10'
    }
  ];

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Button>

        {/* Skill Header */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-gray-700 px-3 py-1 rounded-md text-gray-300 text-sm">
                  {skill.category}
                </span>
                <span className={`font-medium text-sm ${
                  skill.proficiency === 'Advanced' ? 'text-red-400' :
                  skill.proficiency === 'Intermediate' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {skill.proficiency} Level
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {skill.name}
              </h1>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {skill.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Available weekends</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>15 successful swaps</span>
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Request a Swap</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      What skill will you offer in return?
                    </label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white">
                      <option value="">Select a skill...</option>
                      <option value="photography">Digital Photography</option>
                      <option value="cooking">Italian Cooking</option>
                      <option value="guitar">Guitar Playing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message (optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Introduce yourself and explain what you'd like to learn..."
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                    />
                  </div>

                  <Button variant="primary" className="w-full">
                    Send Swap Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Profile */}
        {skill.user && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">About the Teacher</h2>
            
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                {skill.user.profilePhoto ? (
                  <img 
                    src={skill.user.profilePhoto} 
                    alt={skill.user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {skill.user.name}
                </h3>
                
                {skill.user.location && (
                  <div className="flex items-center gap-1 text-gray-400 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{skill.user.location}</span>
                  </div>
                )}
                
                <Rating rating={skill.user.rating} totalRatings={skill.user.totalRatings} />
                
                <div className="mt-4 flex gap-3">
                  <Button variant="outline" size="sm">
                    View Full Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
          
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium">{review.reviewer}</h4>
                    <Rating rating={review.rating} showNumber={false} size="sm" />
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Skills */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Similar Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarSkills.map(similarSkill => (
              <div key={similarSkill.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                <h3 className="text-white font-medium mb-2">{similarSkill.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {similarSkill.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-md text-gray-300">
                    {similarSkill.category}
                  </span>
                  <span className={`text-xs font-medium ${
                    similarSkill.proficiency === 'Advanced' ? 'text-red-400' :
                    similarSkill.proficiency === 'Intermediate' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {similarSkill.proficiency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};