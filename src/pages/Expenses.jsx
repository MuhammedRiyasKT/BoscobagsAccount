import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    amount: '',
    category: 'PURCHASE',
    note: ''
  });

  const categories = ['SALARY', 'TRANSPORT', 'RENT', 'PURCHASE', 'OTHER'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get('/transactions?type=EXPENSE');
      setExpenses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setFormData({
        id: expense._id,
        amount: expense.amount,
        category: expense.category,
        note: expense.note || ''
      });
    } else {
      setFormData({
        id: null,
        amount: '',
        category: 'PURCHASE',
        note: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, type: 'EXPENSE' };
      if (formData.id) {
        await api.put(`/transactions/${formData.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error saving expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchExpenses();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Expenses (Outflow)</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      <div className="table-container">
        {loading ? <p style={{ padding: '1rem' }}>Loading...</p> : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Note</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e._id}>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 500 }}>{e.category}</td>
                  <td style={{ color: 'var(--danger)' }}>₹{e.amount}</td>
                  <td>{e.note || '-'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleOpenModal(e)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 0.5rem', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(e._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No expenses found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formData.id ? 'Edit Expense' : 'Add Expense'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Category *</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Amount (₹) *</label>
                <input required type="number" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Note / Description</label>
                <input type="text" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="e.g. Electricity bill" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
