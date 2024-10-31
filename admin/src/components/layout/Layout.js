import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

function Layout({ isAuthenticated, user, setIsAuthenticated, setUser, children }) {
  return (
    <div className="layout">
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <Navigation />
      <div className="content">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
