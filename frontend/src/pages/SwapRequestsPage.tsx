import React, { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Rating } from '../components/common/Rating';
import { mockSwapRequests } from '../data/mockData';

type TabType = 'current' | 'sent' | 'received' | 'history';

export const SwapRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('current');

  const tabs = [
    { id: 'current' as TabType, label: 'Current Swaps', icon: MessageSquare },
    { id: 'sent' as TabType, label: 'Sent Requests', icon: Clock },
    { id: 'received' as TabType, label: 'Received Requests', icon: CheckCircle },
    { id: 'history' as TabType, label: 'History', icon: XCircle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-yellow-400 bg-yellow-900';
      case 'Accepted': return 'text-green-400 bg-green-900';
      case 'Rejected': return 'text-red-400 bg-red-900';
      case 'Completed': return 'text-blue-400 bg-blue-900';
      case 'Cancelled': return 'text-gray-400 bg-gray-800';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'current':
        return mockSwapRequests.filter(req => req.status === 'Accepted');
      case 'sent':
        return mockSwapRequests.filter(req => req.status === 'Pending');
      case 'received':
        return mockSwapRequests.filter(req => req.status === 'Pending');
      case 'history':
        return mockSwapRequests.filter(req => 
          req.status === 'Completed' || req.status === 'Rejected' || req.status === 'Cancelled'
        );
      default:
        return mockSwapRequests;
    }
  };

  const filteredRequests = getFilteredRequests();

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            My Swaps
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your skill exchange requests and track your learning journey
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

        {/* Request Cards */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-6">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* User Info */}
                  <div className="flex items-center gap-4 lg:w-1/3">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                      {request.sender.profilePhoto ? (
                        <img 
                          src={request.sender.profilePhoto} 
                          alt={request.sender.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {request.sender.name}
                      </h3>
                      <p className="text-sm text-gray-400">{request.sender.location}</p>
                      <Rating rating={request.sender.rating} totalRatings={request.sender.totalRatings} size="sm" />
                    </div>
                  </div>

                  {/* Swap Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">They offer:</p>
                        <p className="text-white font-medium">{request.skillOffered}</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">They want:</p>
                        <p className="text-white font-medium">{request.skillWanted}</p>
                      </div>
                    </div>

                    {request.message && (
                      <div className="bg-gray-800 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-400 mb-1">Message:</p>
                        <p className="text-white">{request.message}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {request.status === 'Pending' && activeTab === 'received' && (
                        <>
                          <Button variant="primary" size="sm">
                            Accept
                          </Button>
                          <Button variant="outline" size="sm">
                            Decline
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'Pending' && activeTab === 'sent' && (
                        <Button variant="outline" size="sm">
                          Cancel Request
                        </Button>
                      )}

                      {request.status === 'Accepted' && (
                        <>
                          <Button variant="primary" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            Mark Complete
                          </Button>
                        </>
                      )}

                      {request.status === 'Completed' && (
                        <Button variant="outline" size="sm">
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No {activeTab} requests
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'current' && "You don't have any active swaps yet."}
              {activeTab === 'sent' && "You haven't sent any requests yet."}
              {activeTab === 'received' && "You haven't received any requests yet."}
              {activeTab === 'history' && "No completed or cancelled swaps to show."}
            </p>
            <Button variant="outline">
              Browse Skills
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};