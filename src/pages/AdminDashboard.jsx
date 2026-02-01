import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StockAlerts from '../components/StockAlerts';
import Loader from '../components/Loader';
import PageTransition from '../components/PageTransition';
import ConfirmationModal from '../components/ConfirmationModal';
import './Dashboard.css';

const AdminDashboard = () => {
  const { pharmacists, setPharmacists, medicines, getStockAlerts, user, logout, fetchMedicines } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, pharmacist: null });

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const [showModal, setShowModal] = useState(false);
  const [editingPharmacist, setEditingPharmacist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license: '',
  });

  const alerts = getStockAlerts();

  // Fetch data from backend
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      try {
        // Fetch pharmacists
        const pharmacistResponse = await fetch(`${apiUrl}/api/admin/pharmacists`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Pharmacist response status:', pharmacistResponse.status);
        if (pharmacistResponse.ok) {
          const pharmacistData = await pharmacistResponse.json();
          console.log('Pharmacist data:', pharmacistData);
          setPharmacists(pharmacistData.map(p => ({ ...p, id: p._id })));
        } else {
          console.error('Failed to fetch pharmacists:', pharmacistResponse.statusText);
        }
        
        // Fetch contacts
        const contactResponse = await fetch(`${apiUrl}/api/contact`);
        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          setContacts(contactData);
        }
        
        // Fetch orders
        const orderResponse = await fetch(`${apiUrl}/api/purchases`);
        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          setOrders(orderData);
        }
        
        // Fetch medicines
        await fetchMedicines();
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchData();
  }, [fetchMedicines]);

  // Calculate stock statistics
  const stockStats = {
    totalMedicines: medicines.length,
    totalStockValue: medicines.reduce((sum, m) => sum + (m.price * m.stock), 0),
    totalUnits: medicines.reduce((sum, m) => sum + m.stock, 0),
    lowStockCount: medicines.filter(m => m.stock < 20 && m.stock > 0).length,
    outOfStockCount: medicines.filter(m => m.stock === 0).length,
    averageStock: medicines.length > 0 
      ? Math.round(medicines.reduce((sum, m) => sum + m.stock, 0) / medicines.length)
      : 0,
    stockByCategory: medicines.reduce((acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + m.stock;
      return acc;
    }, {}),
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    
    try {
      if (editingPharmacist) {
        // Update existing pharmacist
        await fetch(`${apiUrl}/api/admin/pharmacists/${editingPharmacist.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Add new pharmacist
        await fetch(`${apiUrl}/api/admin/pharmacists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      }
      
      // Refresh pharmacists list
      const response = await fetch(`${apiUrl}/api/admin/pharmacists`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPharmacists(data.map(p => ({ ...p, id: p._id })));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving pharmacist:', error);
    }
  };

  const handleEdit = (pharmacist) => {
    setEditingPharmacist(pharmacist);
    setFormData({
      name: pharmacist.name,
      email: pharmacist.email,
      phone: pharmacist.phone,
      license: pharmacist.license,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const pharmacist = pharmacists.find(p => p.id === id);
    setConfirmModal({ isOpen: true, pharmacist });
  };

  const confirmDelete = async () => {
    if (confirmModal.pharmacist) {
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      try {
        await fetch(`${apiUrl}/api/admin/pharmacists/${confirmModal.pharmacist.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Refresh pharmacists list
        setPharmacists(prev => prev.filter(p => p.id !== confirmModal.pharmacist.id));
      } catch (error) {
        console.error('Error deleting pharmacist:', error);
      }
    }
    setConfirmModal({ isOpen: false, pharmacist: null });
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, pharmacist: null });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPharmacist(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      license: '',
    });
  };

  if (loading) return <Loader />;

  return (
    <PageTransition>
    <div className="dashboard">
      <div className="dashboard-topbar">
        <div className="container">
          <div className="topbar-content">
            <h1>Admin Dashboard</h1>
            <div className="user-logout-section">
              <span className="user-name-display">{user?.name}</span>
              <button onClick={handleLogout} className="btn-logout-dashboard">
                <span className="logout-icon"><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="dashboard-header">
          <h2>Manage Pharmacists</h2>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            + Add Pharmacist
          </button>
        </div>

        {alerts.length > 0 && <StockAlerts />}

        {/* Stock Statistics Section */}
        <div className="stats-section">
          <h2>Stock Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💊</div>
              <div className="stat-content">
                <h3>{stockStats.totalMedicines}</h3>
                <p>Total Medicines</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>{stockStats.totalUnits}</h3>
                <p>Total Units in Stock</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>${stockStats.totalStockValue.toFixed(2)}</h3>
                <p>Total Stock Value</p>
              </div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h3>{stockStats.lowStockCount}</h3>
                <p>Low Stock Items</p>
              </div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-icon">🚫</div>
              <div className="stat-content">
                <h3>{stockStats.outOfStockCount}</h3>
                <p>Out of Stock</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stockStats.averageStock}</h3>
                <p>Average Stock Level</p>
              </div>
            </div>
          </div>

          {/* Stock by Category */}
          <div className="category-stock">
            <h3>Stock by Category</h3>
            <div className="category-grid">
              {Object.entries(stockStats.stockByCategory).map(([category, stock]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-stock-value">{stock} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>License</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
  {pharmacists.length === 0 ? (
    <tr key="empty-pharmacists">
      <td colSpan="5" className="empty-state">
        No pharmacists found. Add one to get started.
      </td>
    </tr>
  ) : (
    pharmacists.map(pharmacist => (
      <tr key={pharmacist.id || pharmacist.email}>
        <td>{pharmacist.name}</td>
        <td>{pharmacist.email}</td>
        <td>{pharmacist.phone}</td>
        <td>{pharmacist.license}</td>
        <td>
          <div className="action-buttons">
            <button
              onClick={() => handleEdit(pharmacist)}
              className="btn btn-secondary btn-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(pharmacist.id)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Contact Messages</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr key="empty-contacts">
                    <td colSpan="4" className="empty-state">
                      No contact messages yet.
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact, index) => (
                    <tr key={contact._id || contact.id || `contact-${index}`}>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>
                        <div className="message-preview">
                          {contact.message.length > 100 
                            ? `${contact.message.substring(0, 100)}...` 
                            : contact.message
                          }
                        </div>
                      </td>
                      <td>{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingPharmacist ? 'Edit Pharmacist' : 'Add New Pharmacist'}</h2>
                <button className="close-btn" onClick={handleCloseModal}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter pharmacist name"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>License Number *</label>
                  <input
                    type="text"
                    name="license"
                    value={formData.license}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter license number"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPharmacist ? 'Update' : 'Add'} Pharmacist
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Remove Pharmacist Access"
          message={`Are you sure you want to remove ${confirmModal.pharmacist?.name || 'this pharmacist'} from the system? This action will permanently delete all their data and cannot be undone.`}
          confirmText="Remove Access"
          cancelText="Keep Pharmacist"
          type="danger"
        />
      </div>
    </div>
    </PageTransition>
  );
};

export default AdminDashboard;

