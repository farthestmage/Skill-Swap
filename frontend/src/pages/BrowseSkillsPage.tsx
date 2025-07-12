import React, { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '../../types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
);

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-gray-600 text-white hover:bg-gray-800' 
        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
    } ${className}`}
  >
    {children}
  </button>
);

interface SkillCardProps {
  skill: Skill;
  onViewDetails: (skill: Skill) => void;
  onRequestSwap: (skill: Skill) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onViewDetails, onRequestSwap }) => (
  <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-purple-600 transition-colors">
    <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
    <p className="text-gray-400 mb-4">{skill.description}</p>
    <p className="text-gray-400 mb-4">{}</p>
    <div className="flex gap-2 mb-4">
      <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-sm">{skill.category}</span>
      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm">{skill.proficiency}</span>
      <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-sm">{skill.availability}</span>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => onViewDetails(skill)}>View</Button>
      <Button onClick={() => onRequestSwap(skill)}>Request Swap</Button>
    </div>
  </div>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center gap-2 mt-8">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-1 rounded ${
          currentPage === page 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        {page}
      </button>
    ))}
  </div>
);

// Mock data
const mockSkills = [
  { id: 1, name: 'Web Development', description: 'Learn HTML, CSS, and JavaScript', category: 'Technology', proficiency: 'Intermediate', availability: 'evenings', userId: '1' },
  { id: 2, name: 'Graphic Design', description: 'Master Adobe Creative Suite', category: 'Design', proficiency: 'Advanced', availability: 'weekends', userId: '2' },
  { id: 3, name: 'Spanish Language', description: 'Conversational Spanish lessons', category: 'Languages', proficiency: 'Beginner', availability: 'mornings', userId: '3' },
  { id: 4, name: 'Piano', description: 'Classical and modern piano techniques', category: 'Music', proficiency: 'Intermediate', availability: 'evenings', userId: '4' },
  { id: 5, name: 'Cooking', description: 'Italian cuisine masterclass', category: 'Lifestyle', proficiency: 'Advanced', availability: 'weekends', userId: '5' },
  { id: 6, name: 'Photography', description: 'Portrait and landscape photography', category: 'Arts', proficiency: 'Intermediate', availability: 'weekends', userId: '6' },
  { id: 7, name: 'Yoga', description: 'Hatha and Vinyasa yoga practices', category: 'Health', proficiency: 'Beginner', availability: 'mornings', userId: '7' },
  { id: 8, name: 'Data Science', description: 'Python and machine learning basics', category: 'Technology', proficiency: 'Advanced', availability: 'evenings', userId: '8' },
];

const skillCategories = ['All Categories', 'Technology', 'Design', 'Languages', 'Music', 'Lifestyle', 'Arts', 'Health'];

export const BrowseSkillsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProficiency, setSelectedProficiency] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  // Active filters count
  const activeFiltersCount = [
    selectedCategory !== 'All Categories',
    selectedProficiency !== '',
    selectedAvailability !== '',
    searchTerm !== ''
  ].filter(Boolean).length;

  const filteredSkills = useMemo(() => {
    let skills = [...mockSkills];

    // Apply search filter
    if (searchTerm) {
      skills = skills.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      skills = skills.filter(skill => skill.category === selectedCategory);
    }

    // Apply proficiency filter
    if (selectedProficiency) {
      skills = skills.filter(skill => skill.proficiency === selectedProficiency);
    }

    // Apply availability filter
    if (selectedAvailability) {
      skills = skills.filter(skill => skill.availability === selectedAvailability);
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        skills.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        skills.reverse(); // In real app, sort by creation date
        break;
      case 'rating':
        // In real app, sort by rating
        break;
      default:
        // relevance - keep original order or implement relevance algorithm
        break;
    }

    return skills;
  }, [searchTerm, selectedCategory, selectedProficiency, selectedAvailability, sortBy]);

  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSkills = filteredSkills.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedProficiency, selectedAvailability]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedProficiency('');
    setSelectedAvailability('');
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const handleViewDetails = (skill: Skill) => {
    console.log('View details for skill:', skill.id);
  };

  const handleRequestSwap = (skill: Skill) => {
    console.log('Request swap for skill:', skill.id);
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Browse Skills
          </h1>
          <p className="text-gray-400 text-lg">
            Discover amazing skills from our community of learners and teachers
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search skills..."
              />
            </div>
            
            <div className="flex gap-4">
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center"
                >
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm mr-2">
                    {activeFiltersCount} active
                  </span>
                </motion.div>
              )}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-6 overflow-hidden ${showFilters ? 'block' : 'hidden'} lg:block`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {skillCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Proficiency
                    </label>
                    <select 
                      value={selectedProficiency}
                      onChange={(e) => setSelectedProficiency(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Availability
                    </label>
                    <select 
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Any Time</option>
                      <option value="weekends">Weekends</option>
                      <option value="evenings">Evenings</option>
                      <option value="mornings">Mornings</option>
                    </select>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex justify-end"
                  >
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="text-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear All Filters
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Found <span className="text-white font-semibold">{filteredSkills.length}</span> skills
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
          </p>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          {displayedSkills.length > 0 ? (
            <motion.div
              key="skills-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SkillCard
                      skill={skill}
                      onViewDetails={handleViewDetails}
                      onRequestSwap={handleRequestSwap}
                    />
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No skills found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search criteria or browse all categories.
              </p>
              <Button
                variant="outline"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};