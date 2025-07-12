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
    className="bg-gray-800 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-white"
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


const SkillCard = ({ skill, onViewDetails, onRequestSwap }: any) => (
  <div className="bg-gray-900 p-6 border border-gray-800 hover:border-purple-600 rounded-lg transition-colors">
    <h3 className="mb-2 font-bold text-white text-xl">{skill.name}</h3>
    <p className="mb-4 text-gray-400">{skill.description}</p>
    <p className="mb-4 text-gray-400">{}</p>
    <div className="flex gap-2 mb-4">
      <span className="bg-purple-600/20 px-2 py-1 rounded text-purple-400 text-sm">{skill.category}</span>
      <span className="bg-blue-600/20 px-2 py-1 rounded text-blue-400 text-sm">{skill.proficiency}</span>
      <span className="bg-purple-600/20 px-2 py-1 rounded text-purple-400 text-sm">{skill.availability}</span>
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

  const handleRequestSwap = (skill: any) => {
    window.open(`https://cal.com/mudit1/30min`, "_blank");
  };

  return (
    <div className="bg-black py-8 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-4 font-bold text-white text-3xl lg:text-4xl">
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
          className="bg-gray-900 mb-8 p-6 border border-gray-800 rounded-lg"
        >
          <div className="flex lg:flex-row flex-col gap-4">
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
                  <span className="bg-purple-600/20 mr-2 px-3 py-1 rounded-full text-purple-400 text-sm">
                    {activeFiltersCount} active
                  </span>
                </motion.div>
              )}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="mr-2 w-4 h-4" />
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
                <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 font-medium text-gray-300 text-sm">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-gray-800 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-white"
                    >
                      {skillCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-300 text-sm">
                      Proficiency
                    </label>
                    <select 
                      value={selectedProficiency}
                      onChange={(e) => setSelectedProficiency(e.target.value)}
                      className="bg-gray-800 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-white"
                    >
                      <option value="">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-300 text-sm">
                      Availability
                    </label>
                    <select 
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="bg-gray-800 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-white"
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
                    className="flex justify-end mt-4"
                  >
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="text-sm"
                    >
                      <X className="mr-1 w-4 h-4" />
                      Clear All Filters
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Found <span className="font-semibold text-white">{filteredSkills.length}</span> skills
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
          </p>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
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
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
              className="py-16 text-center"
            >
              <div className="flex justify-center items-center bg-gray-800 mx-auto mb-6 rounded-full w-24 h-24">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="mb-2 font-semibold text-white text-xl">No skills found</h3>
              <p className="mb-6 text-gray-400">
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