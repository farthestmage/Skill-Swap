import React, { useState } from 'react';
import { Users, MessageSquare, AlertTriangle, BarChart, Shield, FileText } from 'lucide-react';
import { Button } from '../components/common/Button';

type TabType = 'overview' | 'users' | 'content' | 'swaps' | 'reports';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'content' as TabType, label: 'Content', icon: Shield },
    { id: 'swaps' as TabType, label: 'Swaps', icon: MessageSquare },
    { id: 'reports' as TabType, label: 'Reports', icon: FileText }
  ];

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', color: 'text-green-400' },
    { label: 'Active Swaps', value: '156', change: '+8%', color: 'text-green-400' },
    { label: 'Reported Content', value: '3', change: '-5%', color: 'text-red-400' },
    { label: 'Revenue', value: '$12,340', change: '+15%', color: 'text-green-400' }
  ];

  const recentUsers = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', joined: '2024-01-20' },
    { id: '2', name: 'Bob Chen', email: 'bob@example.com', status: 'Pending', joined: '2024-01-19' },
    { id: '3', name: 'Carol Martinez', email: 'carol@example.com', status: 'Active', joined: '2024-01-18' }
  ];

  const reportedContent = [
    { id: '1', type: 'Skill', content: 'Inappropriate skill description', reporter: 'User123', date: '2024-01-20' },
    { id: '2', type: 'Profile', content: 'Fake profile image', reporter: 'User456', date: '2024-01-19' }
  ];

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your SkillSwap platform and monitor community health
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-gray-900 p-2 rounded-lg">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                    <span className={`text-sm font-medium ${stat.color}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-4 h-auto flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Manage Users</span>
                </Button>
                <Button variant="outline" className="p-4 h-auto flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  <span>Review Content</span>
                </Button>
                <Button variant="outline" className="p-4 h-auto flex-col">
                  <BarChart className="h-6 w-6 mb-2" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Recent Users</h2>
                <div className="space-y-3">
                  {recentUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Content Reports</h2>
                <div className="space-y-3">
                  {reportedContent.map(report => (
                    <div key={report.id} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white">{report.type}</span>
                      </div>
                      <p className="text-sm text-gray-400">{report.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <Button variant="outline">
                Export Users
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">Joined</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
                    <tr key={user.id} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-white">{user.name}</td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          user.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{user.joined}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="danger" size="sm">Ban</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {(activeTab === 'content' || activeTab === 'swaps' || activeTab === 'reports') && (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'content' && <Shield className="h-8 w-8 text-gray-400" />}
              {activeTab === 'swaps' && <MessageSquare className="h-8 w-8 text-gray-400" />}
              {activeTab === 'reports' && <FileText className="h-8 w-8 text-gray-400" />}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-400">
              This section is under development and will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};