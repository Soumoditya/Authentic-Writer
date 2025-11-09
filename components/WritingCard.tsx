import React from 'react';
import { Writing, User } from '../types';
import { ThumbsUpIcon, ThumbsDownIcon, CommentIcon, ShareIcon } from './Icons';

interface WritingCardProps {
  writing: Writing;
  author: User;
  currentUser: User;
  onFollowToggle: (authorId: string) => void;
  onCardClick: (writing: Writing) => void;
}

export const WritingCard: React.FC<WritingCardProps> = ({ writing, author, currentUser, onFollowToggle, onCardClick }) => {
  const isFollowing = currentUser.following.includes(author.id);
  const isAuthor = currentUser.id === author.id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img className="h-10 w-10 rounded-full mr-4" src={author.avatarUrl} alt={author.name} />
            <div>
              <p className="text-sm font-semibold text-gray-900">{author.name}</p>
              <p className="text-xs text-gray-500">{new Date(writing.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {!isAuthor && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle(author.id);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                isFollowing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        <div className="cursor-pointer" onClick={() => onCardClick(writing)}>
            <h3 className="text-xl font-bold font-serif text-gray-800 mb-2 hover:text-blue-600">{writing.title}</h3>
            <p className="text-gray-600 font-sans leading-relaxed line-clamp-3">{writing.content.replace(/!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g, '')}</p>
        </div>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <ThumbsUpIcon className="w-5 h-5" />
            <span>{writing.stats.upvotes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsDownIcon className="w-5 h-5" />
             <span>{writing.stats.downvotes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CommentIcon className="w-5 h-5" />
            <span>{writing.comments.length}</span>
          </div>
        </div>
        <button className="flex items-center space-x-1 hover:text-gray-900">
          <ShareIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};