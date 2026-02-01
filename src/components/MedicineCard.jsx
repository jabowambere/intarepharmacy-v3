import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PurchaseModal from './PurchaseModal';
import './MedicineCard.css';

const MedicineCard = ({ medicine }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  if (!medicine) return null;

  const priceNumber = Number(medicine.price);
  const displayPrice = Number.isFinite(priceNumber) ? priceNumber : 0;
  return (
    <>
      <div className="medicine-card">
        <div className="medicine-image-container">
          <img 
            src={medicine.image || 'https://via.placeholder.com/300x200/228B22/FFFFFF?text=Medicine'} 
            alt={medicine.name}
            className="medicine-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200/228B22/FFFFFF?text=Medicine';
            }}
          />
        </div>
        
        <div className="medicine-content">
          <h3 className="medicine-name">{medicine.name}</h3>
          <p className="medicine-description">{medicine.description}</p>
          
          <div className="medicine-footer">
            <div className="medicine-price">${displayPrice.toFixed(2)}</div>
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="btn btn-primary btn-purchase"
              disabled={medicine.stock === 0}
            >
              {medicine.stock === 0 ? 'Out of Stock' : 'Purchase'}
            </button>
          </div>
        </div>
      </div>

      {showPurchaseModal && (
        <PurchaseModal
          medicine={medicine}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
    </>
  );
};

export default MedicineCard;

