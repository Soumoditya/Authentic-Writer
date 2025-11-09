import { User, Writing, Analytics, Comment } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/id/1005/100/100', govIdVerified: true, following: ['user-2', 'user-3'] },
  { id: 'user-2', name: 'Maria Garcia', avatarUrl: 'https://picsum.photos/id/1011/100/100', govIdVerified: true, following: ['user-3'] },
  { id: 'user-3', name: 'Chen Wei', avatarUrl: 'https://picsum.photos/id/1025/100/100', govIdVerified: true, following: [] },
];

export const MOCK_WRITINGS: Writing[] = [
  {
    id: 'writing-1',
    authorId: 'user-2',
    title: 'The Future of Urban Gardening',
    content: 'Urban gardening is not just a hobby; it\'s a movement towards sustainable living in concrete jungles. By transforming balconies, rooftops, and small patios into green oases, city dwellers can reconnect with nature and their food sources...\n\nHere is an image of a beautiful rooftop garden:\n![Rooftop Garden](https://picsum.photos/seed/garden/600/400)\n\nFor more information, check out this [great resource](https://example.com).',
    isPublished: true,
    createdAt: new Date('2023-10-26T10:00:00Z'),
    updatedAt: new Date('2023-10-26T11:30:00Z'),
    template: 'article',
    stats: { views: 12500, upvotes: 2300, downvotes: 45 },
    comments: [
        { id: 'comment-1', authorId: 'user-1', content: 'Fantastic article, Maria! Very inspiring.', createdAt: new Date('2023-10-26T12:00:00Z') },
        { id: 'comment-2', authorId: 'user-3', content: 'I agree. I\'m going to start my own balcony garden now.', createdAt: new Date('2023-10-26T14:15:00Z') },
    ],
    fontFamily: 'sans',
    backgroundColor: '#ffffff',
  },
  {
    id: 'writing-2',
    authorId: 'user-3',
    title: 'A Short Story About Time',
    content: 'He found the clock in a dusty antique shop, its hands frozen at 3:14. The shopkeeper warned him it was broken, but he felt an inexplicable pull. That night, as he wound the ancient key, the world outside his window began to blur...',
    isPublished: true,
    createdAt: new Date('2023-10-25T15:20:00Z'),
    updatedAt: new Date('2023-10-25T15:20:00Z'),
    template: 'note',
    stats: { views: 8900, upvotes: 1800, downvotes: 12 },
    comments: [],
    fontFamily: 'serif',
    backgroundColor: '#fefce8', // yellow-50
  },
  {
    id: 'writing-3',
    authorId: 'user-1',
    title: 'Quarterly Tech Report - Q3 2023',
    content: 'This report summarizes the key performance indicators for the third quarter. We saw a significant increase in user engagement following the new feature launch. However, server costs have also risen, requiring a strategy for optimization...',
    isPublished: false,
    createdAt: new Date('2023-10-22T09:00:00Z'),
    updatedAt: new Date('2023-10-27T14:00:00Z'),
    template: 'report',
    stats: { views: 0, upvotes: 0, downvotes: 0 },
    comments: [],
    fontFamily: 'mono',
    backgroundColor: '#f3f4f6', // gray-100
  },
];

export const MOCK_ANALYTICS: Analytics = {
    totalViews: 450000,
    totalUpvotes: 15200,
    followers: 2100,
    estimatedEarnings: 345.67,
    performanceHistory: [
        { month: 'May', views: 50000 },
        { month: 'Jun', views: 75000 },
        { month: 'Jul', views: 120000 },
        { month: 'Aug', views: 95000 },
        { month: 'Sep', views: 110000 },
    ],
};