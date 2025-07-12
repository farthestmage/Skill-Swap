import React, { useState } from 'react';
import { Edit, Plus, MapPin, Calendar, User as UserIcon, Clock, X, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Rating } from '../components/common/Rating';
import { mockUsers, mockSkills } from '../data/mockData';
import { Switch } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

export const UserProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPublicProfile, setIsPublicProfile] = useState(mockUsers[0].isPublic);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  const user = mockUsers[0]; // Mock current user
  const userSkills = mockSkills.filter(skill => skill.userId === user.id);

  const skillsWanted = [
    { id: '1', name: 'Data Science', category: 'Programming', priority: 'High' },
    { id: '2', name: 'Italian Cooking', category: 'Cooking', priority: 'Medium' },
    { id: '3', name: 'Piano Playing', category: 'Music', priority: 'Low' }
  ];

  const [availability, setAvailability] = useState([
    { id: '1', day: 'Monday', timeSlot: 'Evening', selected: true },
    { id: '2', day: 'Wednesday', timeSlot: 'Evening', selected: true },
    { id: '3', day: 'Saturday', timeSlot: 'Morning', selected: true },
    { id: '4', day: 'Sunday', timeSlot: 'Afternoon', selected: true }
  ]);

  // // All possible time slots
  // const allTimeSlots = [
  //   { day: 'Monday', timeSlot: 'Morning' },
  //   { day: 'Monday', timeSlot: 'Afternoon' },
  //   { day: 'Monday', timeSlot: 'Evening' },
  //   { day: 'Tuesday', timeSlot: 'Morning' },
  //   { day: 'Tuesday', timeSlot: 'Afternoon' },
  //   { day: 'Tuesday', timeSlot: 'Evening' },
  //   { day: 'Wednesday', timeSlot: 'Morning' },
  //   { day: 'Wednesday', timeSlot: 'Afternoon' },
  //   { day: 'Wednesday', timeSlot: 'Evening' },
  //   { day: 'Thursday', timeSlot: 'Morning' },
  //   { day: 'Thursday', timeSlot: 'Afternoon' },
  //   { day: 'Thursday', timeSlot: 'Evening' },
  //   { day: 'Friday', timeSlot: 'Morning' },
  //   { day: 'Friday', timeSlot: 'Afternoon' },
  //   { day: 'Friday', timeSlot: 'Evening' },
  //   { day: 'Saturday', timeSlot: 'Morning' },
  //   { day: 'Saturday', timeSlot: 'Afternoon' },
  //   { day: 'Saturday', timeSlot: 'Evening' },
  //   { day: 'Sunday', timeSlot: 'Morning' },
  //   { day: 'Sunday', timeSlot: 'Afternoon' },
  //   { day: 'Sunday', timeSlot: 'Evening' }
  // ];

  const toggleAvailabilitySlot = (day: string, timeSlot: string) => {
    if (!isEditingSchedule) return;
    
    // const slotId = `${day}-${timeSlot}`;
    const existingIndex = availability.findIndex(slot => 
      slot.day === day && slot.timeSlot === timeSlot
    );

    if (existingIndex >= 0) {
      // Remove existing slot
      setAvailability(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      // Add new slot
      setAvailability(prev => [...prev, {
        id: Date.now().toString(),
        day,
        timeSlot,
        selected: true
      }]);
    }
  };

    const toggleSlotSelection = (slotId: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const isSlotInSelectedSlots = (slotId: string) => {
    return selectedSlots.includes(slotId);
  };

  const isSlotSelected = (day: string, timeSlot: string) => {
    return availability.some(slot => slot.day === day && slot.timeSlot === timeSlot);
  };

  const saveSchedule = () => {
    setIsEditingSchedule(false);
    // Here you would typically save to backend
  };

  const cancelScheduleEdit = () => {
    setIsEditingSchedule(false);
    // Reset to original state if needed
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg p-8 mb-8"
        >
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
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Edit className="h-4 w-4 text-black" />
                </motion.button>
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
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Profile Visibility</h3>
                <p className="text-sm text-gray-400">Control who can see your profile</p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={isPublicProfile}
                  onChange={setIsPublicProfile}
                  className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-600 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-2 data-[focus]:outline-white data-[checked]:bg-gradient-to-r data-[checked]:from-purple-600 data-[checked]:to-blue-600"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                  />
                </Switch>
                <span className="text-sm text-gray-300">
                  {isPublicProfile ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills Offered */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Skills I Offer</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userSkills.map(skill => (
              <motion.div 
                key={skill.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-colors"
              >
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Wanted */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Skills I Want to Learn</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Interest
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsWanted.map(skill => (
              <motion.div 
                key={skill.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-colors"
              >
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Availability */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">Availability</h2>
              <span className="text-sm text-gray-400">
                ({availability.length} slots selected)
              </span>
            </div>
            <div className="flex gap-2">
              {isEditingSchedule ? (
                <>
                  <Button variant="outline" size="sm" onClick={cancelScheduleEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={saveSchedule}>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditingSchedule(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Schedule
                </Button>
              )}
            </div>
          </div>

          {isEditingSchedule ? (
            <div className="space-y-6">
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Select your available time slots</span>
                </div>
                <p className="text-sm text-gray-400">
                  Click on time slots to add or remove them from your availability
                </p>
              </div>
              
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <div key={day} className="space-y-2">
                  <h3 className="text-white font-medium">{day}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['Morning', 'Afternoon', 'Evening'].map(timeSlot => (
                      <motion.button
                        key={`${day}-${timeSlot}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleAvailabilitySlot(day, timeSlot)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          isSlotSelected(day, timeSlot)
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500 text-white shadow-lg'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                        }`}
                      >
                        {timeSlot}
                        {isSlotSelected(day, timeSlot) && (
                          <Check className="h-3 w-3 ml-1 inline" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatePresence>
                {availability.map((slot) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSlotSelection(slot.id)}
                    className={`rounded-lg p-3 text-center border transition-all cursor-pointer ${
                      isSlotInSelectedSlots(slot.id)
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500 text-white shadow-lg'
                        : 'bg-gray-800 border-gray-700 hover:border-purple-500/50 text-white'
                    }`}
                  >
                    <div className="font-medium">{slot.day}</div>
                    <div className="text-sm mt-1 opacity-90">{slot.timeSlot}</div>
                    {isSlotInSelectedSlots(slot.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1"
                      >
                        <Check className="h-3 w-3" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-white font-medium">Timezone</span>
            </div>
            <p className="text-gray-400 text-sm">
              Pacific Standard Time (PST) - UTC-8
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};