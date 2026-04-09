import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState({
    todayIncome: 0,
    todayExpense: 0,
    currentBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    pendingCredit: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/reports/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Today's Income */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Today's Income</p>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>{formatCurrency(data.todayIncome)}</h3>
            </div>
            <div style={{ backgroundColor: '#ecfdf5', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--success)' }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Today's Expense */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Today's Expense</p>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>{formatCurrency(data.todayExpense)}</h3>
            </div>
            <div style={{ backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--danger)' }}>
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        {/* Current Balance */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Current Balance</p>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--primary)' }}>{formatCurrency(data.currentBalance)}</h3>
            </div>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--primary)' }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* Pending Credit */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Pending Credit To Receive</p>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--warning)' }}>{formatCurrency(data.pendingCredit)}</h3>
            </div>
            <div style={{ backgroundColor: '#fffbeb', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--warning)' }}>
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
