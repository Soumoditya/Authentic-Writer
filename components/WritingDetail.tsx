import React, { useState, useMemo } from 'react';
import { Writing, User, Comment } from '../types';
import { ThumbsUpIcon, ThumbsDownIcon, CommentIcon, ShareIcon } from './Icons';

interface WritingDetailProps {
    writing: Writing;
    users: User[];
    currentUser: User;
    onClose: () => void;
    onUpdateWriting: (writing: Writing) => void;
    onFollowToggle: (authorId: string) => void;
}

// A simple markdown to HTML renderer
const ContentView: React.FC<{ content: string }> = ({ content }) => {
    const html = useMemo(() => {
        return content
            .replace(/</g, '&lt;').replace(/>/g, '&gt;') // Basic sanitize
            .replace(/\n/g, '<br />') // New lines
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-lg shadow-md max-w-full h-auto mx-auto" />') // Images
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'); // Links
    }, [content]);

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};


export const WritingDetail: React.FC<WritingDetailProps> = ({ writing, users, currentUser, onClose, onUpdateWriting, onFollowToggle }) => {
    const [newComment, setNewComment] = useState('');
    const author = users.find(u => u.id === writing.authorId);
    
    if (!author) return null;

    const isFollowing = currentUser.following.includes(author.id);
    const isAuthor = currentUser.id === author.id;
    
    const fontClasses = {
        serif: 'font-serif',
        sans: 'font-sans',
        mono: 'font-mono',
    };

    const handleVote = (type: 'up' | 'down') => {
        const newStats = { ...writing.stats };
        if(type === 'up') newStats.upvotes += 1;
        if(type === 'down') newStats.downvotes += 1;
        onUpdateWriting({ ...writing, stats: newStats });
    };

    const handleAddComment = () => {
        if(newComment.trim() === '') return;
        const comment: Comment = {
            id: `comment-${Date.now()}`,
            authorId: currentUser.id,
            content: newComment,
            createdAt: new Date(),
        };
        onUpdateWriting({ ...writing, comments: [...writing.comments, comment] });
        setNewComment('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-serif">{writing.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </header>
                
                <div className="flex-grow overflow-y-auto">
                    <div className="p-8" style={{ backgroundColor: writing.backgroundColor }}>
                        <div className={`text-lg leading-relaxed ${fontClasses[writing.fontFamily]}`}>
                            <ContentView content={writing.content} />
                        </div>
                    </div>
                    <div className="p-6 border-t">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <img className="h-12 w-12 rounded-full mr-4" src={author.avatarUrl} alt={author.name} />
                                <div>
                                    <p className="font-semibold">{author.name}</p>
                                    <p className="text-sm text-gray-500">Published on {new Date(writing.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            {!isAuthor && (
                                <button onClick={() => onFollowToggle(author.id)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${ isFollowing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </div>

                        <div className="flex items-center space-x-6 text-gray-600">
                             <button onClick={() => handleVote('up')} className="flex items-center space-x-1 hover:text-blue-600">
                                <ThumbsUpIcon className="w-6 h-6" />
                                <span>{writing.stats.upvotes}</span>
                            </button>
                            <button onClick={() => handleVote('down')} className="flex items-center space-x-1 hover:text-red-600">
                                <ThumbsDownIcon className="w-6 h-6" />
                                <span>{writing.stats.downvotes}</span>
                            </button>
                            <div className="flex items-center space-x-1">
                                <CommentIcon className="w-6 h-6" />
                                <span>{writing.comments.length} Comments</span>
                            </div>
                            <button className="flex items-center space-x-1 hover:text-gray-900">
                                <ShareIcon className="w-6 h-6" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Comment Section */}
                    <div className="p-6 bg-gray-50">
                        <h4 className="font-bold mb-4">Comments</h4>
                        <div className="space-y-4 mb-6">
                            {writing.comments.map(comment => {
                                const commentAuthor = users.find(u => u.id === comment.authorId);
                                return (
                                    <div key={comment.id} className="flex items-start space-x-3">
                                        <img src={commentAuthor?.avatarUrl} alt={commentAuthor?.name} className="w-8 h-8 rounded-full" />
                                        <div className="bg-white p-3 rounded-lg border w-full">
                                            <p className="font-semibold text-sm">{commentAuthor?.name}</p>
                                            <p className="text-gray-700">{comment.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-start space-x-3">
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                            <div className="w-full">
                                <textarea 
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    placeholder="Add a comment..."
                                ></textarea>
                                <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Post Comment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};