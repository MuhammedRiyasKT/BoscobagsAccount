import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { user, loading } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      {/* Mobile Topbar */}
      <div className="mobile-topbar" style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '60px',
        backgroundColor: 'white',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center',
        padding: '0 1rem',
        zIndex: 30
      }}>
        <button 
          onClick={() => setMobileOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '1rem' }}
          className="mobile-only-btn"
        >
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 'bold' }}>Bosco Accounts</span>
      </div>

      <style>
        {`
          .mobile-only-btn { display: none; }
          .mobile-topbar { display: none; }
          @media (max-width: 768px) {
            .mobile-only-btn { display: block; }
            .mobile-topbar { display: flex; }
          }
        `}
      </style>

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
