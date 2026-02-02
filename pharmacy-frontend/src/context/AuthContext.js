import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [pharmacists, setPharmacists] = useState(() => {
    const saved = localStorage.getItem('pharmacists');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@pharmacy.com', phone: '555-0101', license: 'PH-12345' },
      { id: 2, name: 'Dr. Michael Chen', email: 'michael@pharmacy.com', phone: '555-0102', license: 'PH-12346' },
    ];
  });
  const [orders, setOrders] = useState([]);

  // Initialize user and fetch medicines
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
    fetchMedicines();
  }, []);



  // Save pharmacists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pharmacists', JSON.stringify(pharmacists));
  }, [pharmacists]);

  const login = async (email, password, role) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Backend not available, using fallback login:', err);
      // Fallback to local authentication
      let userData = null;
      
      if (role === 'admin' && normalizedEmail === 'admin@pharmacy.com' && password === 'compwizard') {
        userData = { id: 'admin', email: normalizedEmail, role: 'admin', name: 'Admin User' };
      } else if (role === 'pharmacist' && password === 'pharmacist123') {
        const pharmacist = pharmacists.find(p => p.email.toLowerCase() === normalizedEmail);
        if (pharmacist) {
          userData = { id: pharmacist.id, email: normalizedEmail, role: 'pharmacist', name: pharmacist.name };
        }
      }
      
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', 'fallback-token');
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const fetchMedicines = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/medicines`);
      const data = await res.json();
      const formattedMedicines = data.map(med => ({
        id: med._id,
        name: med.name,
        description: med.description,
        price: med.price,
        stock: med.quantity,
        category: med.category,
        image: med.image
      }));
      setMedicines(formattedMedicines);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const getStockAlerts = () => {
    return medicines.filter(medicine => medicine.stock < 20);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    medicines,
    setMedicines,
    fetchMedicines,
    pharmacists,
    setPharmacists,
    orders,
    setOrders,
    getStockAlerts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

