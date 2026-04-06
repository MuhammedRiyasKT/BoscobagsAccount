import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, shopName: '', phoneNumber: '', address: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setFormData({ id: customer._id, shopName: customer.shopName, phoneNumber: customer.phoneNumber, address: customer.address || '' });
    } else {
      setFormData({ id: null, shopName: '', phoneNumber: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/customers/${formData.id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error(error);
      alert('Error saving customer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Customers Management</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="table-container">
        {loading ? <p style={{ padding: '1rem' }}>Loading...</p> : (
          <table>
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 500 }}>{c.shopName}</td>
                  <td>{c.phoneNumber}</td>
                  <td>{c.address || '-'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleOpenModal(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 0.5rem', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(c._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No customers found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formData.id ? 'Edit Customer' : 'Add Customer'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Shop/Customer Name *</label>
                <input required type="text" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Phone Number *</label>
                <input required type="text" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                Save Customer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
