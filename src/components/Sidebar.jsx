import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ArrowUpRight, ArrowDownRight, FileText, LogOut, Menu, X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Sales (In)', path: '/sales', icon: <ArrowUpRight size={20} className="text-success" /> },
    { name: 'Expenses (Out)', path: '/expenses', icon: <ArrowDownRight size={20} className="text-danger" /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside style={{
        width: '250px',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease',
        transform: mobileOpen ? 'translateX(0)' : 'none',
        zIndex: 50,
      }} className={window.innerWidth <= 768 && !mobileOpen ? 'mobile-hidden' : ''}>
        
        {/* Mobile styling hack within React */}
        <style>
          {`
            @media (max-width: 768px) {
              .mobile-hidden { transform: translateX(-100%) !important; }
            }
            .nav-link {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.75rem 1.5rem;
              color: var(--text-muted);
              text-decoration: none;
              font-weight: 500;
              transition: all 0.2s;
            }
            .nav-link:hover {
              background-color: var(--bg-color);
              color: var(--primary);
            }
            .nav-link.active {
              background-color: #eff6ff;
              color: var(--primary);
              border-right: 3px solid var(--primary);
            }
          `}
        </style>

        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>Bosco Accounts</h1>
          <button 
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: window.innerWidth > 768 ? 'none' : 'block' }}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, marginTop: '1rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Logged in as <b>{user?.username}</b>
          </div>
          <button onClick={handleLogout} className="btn" style={{ width: '100%', justifyContent: 'center', backgroundColor: '#fef2f2', color: 'var(--danger)' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
