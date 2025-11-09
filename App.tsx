import React, { useState, useCallback, useEffect } from 'react';
import { User, Page, Writing, Comment } from './types';
import { MOCK_USERS, MOCK_WRITINGS } from './constants';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Feed } from './components/Feed';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { WritingDetail } from './components/WritingDetail';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>(Page.Feed);
  
  const [users, setUsers] = useState<User[]>([]);
  const [writings, setWritings] = useState<Writing[]>([]);

  const [editingWriting, setEditingWriting] = useState<Writing | null>(null);
  const [viewingWriting, setViewingWriting] = useState<Writing | null>(null);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('authentic-writer-users');
      const savedWritings = localStorage.getItem('authentic-writer-writings');
      
      setUsers(savedUsers ? JSON.parse(savedUsers) : MOCK_USERS);
      setWritings(savedWritings ? JSON.parse(savedWritings) : MOCK_WRITINGS);
    } catch (error) {
        console.error("Failed to load from localStorage", error);
        setUsers(MOCK_USERS);
        setWritings(MOCK_WRITINGS);
    }
  }, []);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
        if(users.length > 0) localStorage.setItem('authentic-writer-users', JSON.stringify(users));
        if(writings.length > 0) localStorage.setItem('authentic-writer-writings', JSON.stringify(writings));
    } catch(error) {
        console.error("Failed to save to localStorage", error);
    }
  }, [users, writings]);

  const handleLogin = () => {
    setCurrentUser(users[0]); // Log in as the first user
    setActivePage(Page.Feed);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleNavigate = useCallback((page: Page) => {
    setActivePage(page);
    setEditingWriting(null);
    setViewingWriting(null);
  }, []);
  
  const handleNewWriting = () => {
      setEditingWriting({} as Writing); // Open editor with a blank slate
  };

  const handleEditWriting = (writing: Writing) => {
      setEditingWriting(writing);
  }

  const handleSaveWriting = (writing: Writing) => {
      setWritings(prevWritings => {
          const exists = prevWritings.some(w => w.id === writing.id);
          if(exists) {
              return prevWritings.map(w => w.id === writing.id ? writing : w);
          }
          return [...prevWritings, writing];
      });
      setEditingWriting(null);
      setActivePage(Page.Dashboard);
  };
  
  const handleCloseEditor = () => {
      setEditingWriting(null);
  };
  
  const handleViewWriting = (writing: Writing) => {
      setViewingWriting(writing);
  };
  
  const handleCloseDetail = () => {
      setViewingWriting(null);
  };
  
  const handleUpdateWriting = (updatedWriting: Writing) => {
      const newWritings = writings.map(w => w.id === updatedWriting.id ? updatedWriting : w);
      setWritings(newWritings);
      if (viewingWriting && viewingWriting.id === updatedWriting.id) {
          setViewingWriting(updatedWriting);
      }
  };
  
  const handleFollowToggle = (authorId: string) => {
      if(!currentUser) return;
      setUsers(prevUsers => prevUsers.map(user => {
          if(user.id === currentUser.id) {
              const following = user.following.includes(authorId)
                  ? user.following.filter(id => id !== authorId)
                  : [...user.following, authorId];
              setCurrentUser({...user, following});
              return {...user, following};
          }
          return user;
      }));
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }
  
  const renderPage = () => {
    switch (activePage) {
      case Page.Feed:
        return <Feed writings={writings} users={users} currentUser={currentUser} onFollowToggle={handleFollowToggle} onViewWriting={handleViewWriting}/>;
      case Page.Dashboard:
        return <Dashboard user={currentUser} writings={writings} onEditWriting={handleEditWriting} />;
      default:
        return <Feed writings={writings} users={users} currentUser={currentUser} onFollowToggle={handleFollowToggle} onViewWriting={handleViewWriting}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={currentUser} 
        activePage={activePage} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onNewWriting={handleNewWriting}
      />
      <main>
        {renderPage()}
      </main>
      
      {editingWriting && (
          <Editor 
            writing={editingWriting.id ? editingWriting : null} 
            onSave={handleSaveWriting} 
            onClose={handleCloseEditor}
            currentUser={currentUser}
          />
      )}
      
      {viewingWriting && (
          <WritingDetail 
            writing={viewingWriting}
            users={users}
            currentUser={currentUser}
            onClose={handleCloseDetail}
            onUpdateWriting={handleUpdateWriting}
            onFollowToggle={handleFollowToggle}
          />
      )}
    </div>
  );
};

export default App;
