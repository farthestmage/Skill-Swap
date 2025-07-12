import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Star, Zap, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { SkillCard } from '../components/common/SkillCard';
import { mockSkills } from '../data/mockData';

export const HomePage: React.FC = () => {
  const featuredSkills = mockSkills.slice(0, 3);

  const stats = [
    { label: 'Active Users', value: '2,847', icon: Users },
    { label: 'Skills Available', value: '1,235', icon: Star },
    { label: 'Successful Swaps', value: '892', icon: Zap },
    { label: 'Trust Rating', value: '4.9/5', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Exchange Skills,
              <br />
              <span className="text-gray-400">Unlock Potential</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Connect with a community of learners and teachers. Share what you know, 
              learn what you want, and grow together through skill exchange.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Browse Skills
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Featured Skills
            </h2>
            <p className="text-xl text-gray-400">
              Discover popular skills from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onViewDetails={() => {}}
                onRequestSwap={() => {}}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/browse">
              <Button variant="outline" size="lg">
                View All Skills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Start your skill exchange journey in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'List the skills you can teach and what you want to learn'
              },
              {
                step: '02',
                title: 'Find a Match',
                description: 'Browse skills or let others find you based on mutual interests'
              },
              {
                step: '03',
                title: 'Start Learning',
                description: 'Connect with your match and begin your skill exchange journey'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};