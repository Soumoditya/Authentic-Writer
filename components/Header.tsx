
import React from 'react';
import { User, Page } from '../types';

interface HeaderProps {
  user: User;
  activePage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onNewWriting: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, activePage, onNavigate, onLogout, onNewWriting }) => {
  const NavLink: React.FC<{ page: Page; children: React.ReactNode }> = ({ page, children }) => (
    <button
      onClick={() => onNavigate(page)}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        activePage === page
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-200'
      } transition-colors`}
    >
      {children}
    </button>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-serif text-xl font-bold text-blue-600">Authentic Writer</span>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink page={Page.Feed}>Feed</NavLink>
                <NavLink page={Page.Dashboard}>Dashboard</NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <button
                onClick={onNewWriting}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm shadow"
              >
                New Writing
              </button>
            <div className="relative">
              <img className="h-9 w-9 rounded-full" src={user.avatarUrl} alt={user.name} />
            </div>
            <button onClick={onLogout} className="text-gray-500 hover:text-gray-700 text-sm">Logout</button>
          </div>
        </div>
      </nav>
    </header>
  );
};
