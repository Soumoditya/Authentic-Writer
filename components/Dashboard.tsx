import React, { useState } from 'react';
import { MOCK_ANALYTICS } from '../constants';
import { User, Writing } from '../types';

interface DashboardProps {
    user: User;
    writings: Writing[];
    onEditWriting: (writing: Writing) => void;
}

const AnalyticsChart: React.FC = () => {
    const data = MOCK_ANALYTICS.performanceHistory;
    const maxViews = Math.max(...data.map(d => d.views));

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-bold mb-4 text-gray-700">Monthly Views</h4>
            <div className="flex items-end h-48 space-x-4">
                {data.map(item => (
                    <div key={item.month} className="flex-1 flex flex-col items-center">
                        <div 
                            className="w-full bg-blue-400 hover:bg-blue-500 rounded-t-md"
                            style={{ height: `${(item.views / maxViews) * 100}%` }}
                            title={`${item.views.toLocaleString()} views`}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ user, writings, onEditWriting }) => {
  const [activeTab, setActiveTab] = useState('writings');
  const userWritings = writings.filter(w => w.authorId === user.id)
    .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const analytics = MOCK_ANALYTICS;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <img className="h-20 w-20 rounded-full mr-6" src={user.avatarUrl} alt={user.name} />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500">Your personal author dashboard.</p>
        </div>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('writings')}
            className={`${
              activeTab === 'writings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Writings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Analytics & Earnings
          </button>
        </nav>
      </div>

      {activeTab === 'writings' && (
        <div className="bg-white shadow rounded-lg">
            <ul className="divide-y divide-gray-200">
                {userWritings.map(writing => (
                    <li key={writing.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800">{writing.title}</p>
                            <p className="text-sm text-gray-500">
                                Last updated: {new Date(writing.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${writing.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {writing.isPublished ? 'Published' : 'Private'}
                            </span>
                            <button onClick={() => onEditWriting(writing)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <h4 className="text-sm font-medium text-gray-500">Total Views</h4>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <h4 className="text-sm font-medium text-gray-500">Followers</h4>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{analytics.followers.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <h4 className="text-sm font-medium text-gray-500">Total Upvotes</h4>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{analytics.totalUpvotes.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <h4 className="text-sm font-medium text-gray-500">Est. Earnings</h4>
                <p className="mt-1 text-3xl font-semibold text-green-600">${analytics.estimatedEarnings.toFixed(2)}</p>
            </div>
            <div className="md:col-span-2 lg:col-span-4">
                <AnalyticsChart />
            </div>
        </div>
      )}
    </div>
  );
};