import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    amount: '',
    customerId: '',
    customerType: 'WHOLESALE',
    paymentStatus: 'PAID',
    paidAmount: '',
    note: ''
  });

  useEffect(() => {
    fetchSales();
    fetchCustomers();
  }, []);

  const fetchSales = async () => {
    try {
      const { data } = await api.get('/transactions?type=INCOME');
      setSales(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (sale = null) => {
    if (sale) {
      setFormData({
        id: sale._id,
        amount: sale.amount,
        customerId: sale.customerId?._id || '',
        customerType: sale.customerType,
        paymentStatus: sale.paymentStatus,
        paidAmount: sale.paidAmount || '',
        note: sale.note || ''
      });
    } else {
      setFormData({
        id: null,
        amount: '',
        customerId: customers.length > 0 ? customers[0]._id : '',
        customerType: 'WHOLESALE',
        paymentStatus: 'PAID',
        paidAmount: '',
        note: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, type: 'INCOME' };
      if (formData.id) {
        await api.put(`/transactions/${formData.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      setIsModalOpen(false);
      fetchSales();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error saving sale');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchSales();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Sales (Income)</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Record Sale
        </button>
      </div>

      <div className="table-container">
        {loading ? <p style={{ padding: '1rem' }}>Loading...</p> : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s._id}>
                  <td>{new Date(s.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 500 }}>{s.customerId?.shopName || 'Unknown Customer'}</td>
                  <td>{s.customerType}</td>
                  <td style={{ color: 'var(--success)' }}>₹{s.amount}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: s.paymentStatus === 'PAID' ? '#ecfdf5' : s.paymentStatus === 'PENDING' ? '#fef2f2' : '#fffbeb',
                      color: s.paymentStatus === 'PAID' ? 'var(--success)' : s.paymentStatus === 'PENDING' ? 'var(--danger)' : 'var(--warning)',
                    }}>
                      {s.paymentStatus}
                    </span>
                  </td>
                  <td>{s.paidAmount !== undefined ? `₹${s.paidAmount}` : '-'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleOpenModal(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 0.5rem', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(s._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No sales records found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formData.id ? 'Edit Sale' : 'Record Sale'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            {customers.length === 0 ? (
              <p style={{ color: 'var(--danger)' }}>Please add a customer first in the Customers tab before recording a sale.</p>
            ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Customer *</label>
                <select 
                  required 
                  value={formData.customerId} 
                  onChange={e => setFormData({...formData, customerId: e.target.value})}
                >
                  <option value="">Select a customer</option>
                  {customers.map(c => <option key={c._id} value={c._id}>{c.shopName}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label>Sale Type *</label>
                <select value={formData.customerType} onChange={e => setFormData({...formData, customerType: e.target.value})}>
                  <option value="WHOLESALE">Wholesale</option>
                  <option value="RETAIL">Retail</option>
                </select>
              </div>

              <div className="input-group">
                <label>Total Amount (₹) *</label>
                <input required type="number" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>

              <div className="input-group">
                <label>Payment Status *</label>
                <select value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
                  <option value="PAID">Paid in Full</option>
                  <option value="PARTIAL">Partial Payment</option>
                  <option value="PENDING">Pending (Credit)</option>
                </select>
              </div>

              {formData.paymentStatus === 'PARTIAL' && (
                <div className="input-group">
                  <label>Amount Paid Now (₹) *</label>
                  <input required type="number" min="0" max={formData.amount || Infinity} value={formData.paidAmount} onChange={e => setFormData({...formData, paidAmount: e.target.value})} />
                </div>
              )}

              <div className="input-group">
                <label>Note (Optional)</label>
                <input type="text" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                Save Sale
              </button>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
