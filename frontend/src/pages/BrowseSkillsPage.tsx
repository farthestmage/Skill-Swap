import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { SearchBar } from '../components/common/SearchBar';
import { SkillCard } from '../components/common/SkillCard';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { mockSkills, skillCategories } from '../data/mockData';
import { Skill } from '../types';

export const BrowseSkillsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  const filteredSkills = useMemo(() => {
    return mockSkills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || skill.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSkills = filteredSkills.slice(startIndex, startIndex + itemsPerPage);

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
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Browse Skills
          </h1>
          <p className="text-gray-400 text-lg">
            Discover amazing skills from our community of learners and teachers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search skills..."
              />
            </div>
            
            <div className="flex gap-4">
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
          <div className={`mt-4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
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
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white">
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
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white">
                  <option value="">Any Time</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="mornings">Mornings</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Found {filteredSkills.length} skills
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
          </p>
          
          <select className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white">
            <option value="relevance">Sort by Relevance</option>
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Skills Grid */}
        {displayedSkills.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSkills.map(skill => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onViewDetails={handleViewDetails}
                  onRequestSwap={handleRequestSwap}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No skills found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or browse all categories.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};