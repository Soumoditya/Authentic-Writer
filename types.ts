export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  govIdVerified: boolean;
  following: string[]; // Array of user IDs
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface Writing {
  id: string;
  authorId: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  template: 'blank' | 'report' | 'article' | 'note';
  stats: {
    views: number;
    upvotes: number;
    downvotes: number;
  };
  comments: Comment[];
  // New styling properties
  fontFamily: 'serif' | 'sans' | 'mono';
  backgroundColor: string;
}

export interface Analytics {
  totalViews: number;
  totalUpvotes: number;
  followers: number;
  estimatedEarnings: number;
  performanceHistory: { month: string; views: number }[];
}

export enum Page {
  Feed,
  Editor,
  Dashboard
}