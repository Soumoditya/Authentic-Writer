
import React, { useState, useMemo } from 'react';
import { WritingCard } from './WritingCard';
import { Writing, User } from '../types';

interface FeedProps {
    writings: Writing[];
    users: User[];
    currentUser: User;
    onFollowToggle: (authorId: string) => void;
    onViewWriting: (writing: Writing) => void;
}

export const Feed: React.FC<FeedProps> = ({ writings, users, currentUser, onFollowToggle, onViewWriting }) => {
  const [activeTab, setActiveTab] = useState('trending');
  
  const publishedWritings = useMemo(() => writings.filter(w => w.isPublished), [writings]);

  const trendingWritings = useMemo(() => {
    return [...publishedWritings].sort((a, b) => {
      const scoreA = a.stats.upvotes * 10 + a.stats.views - a.stats.downvotes * 5;
      const scoreB = b.stats.upvotes * 10 + b.stats.views - b.stats.downvotes * 5;
      return scoreB - scoreA;
    });
  }, [publishedWritings]);
  
  const followingWritings = useMemo(() => {
    return publishedWritings.filter(w => currentUser.following.includes(w.authorId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [publishedWritings, currentUser.following]);
  
  const writingsToDisplay = activeTab === 'trending' ? trendingWritings : followingWritings;

  const getUserById = (id: string) => users.find(u => u.id === id);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('trending')}
              className={`${
                activeTab === 'trending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`${
                activeTab === 'following'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Following
            </button>
          </nav>
        </div>
        <div className="space-y-6">
          {writingsToDisplay.length > 0 ? (
            // FIX: Corrected typo from writingsToДшisplay to writingsToDisplay
            writingsToDisplay.map(writing => {
                const author = getUserById(writing.authorId);
                if (!author) return null;
                return (
                    <WritingCard 
                        key={writing.id} 
                        writing={writing} 
                        author={author}
                        currentUser={currentUser}
                        onFollowToggle={onFollowToggle}
                        onCardClick={onViewWriting}
                    />
                );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {activeTab === 'following' 
                    ? 'Content from authors you follow will appear here.'
                    : 'No writings found.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
