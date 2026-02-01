import Purchase from "../models/Purchase.js";

export const createPurchase = async (req, res) => {
  try {
    const { medicineId, customerName, customerEmail, customerPhone, customerAddress, quantity, prescription } = req.body;
    
    const purchase = new Purchase({
      medicineName: req.body.medicineName || 'Medicine',
      medicineId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      quantity,
      totalPrice: req.body.totalPrice || 0,
      prescription: prescription || ''
    });
    
    await purchase.save();
    
    // Send order confirmation email
    try {
      console.log('🔧 Attempting to send email via Brevo API...');
      console.log('📧 To:', customerEmail);
      
      const emailData = {
        sender: {
          name: "Intare Pharmacy",
          email: process.env.FROM_EMAIL
        },
        to: [{
          email: customerEmail,
          name: customerName
        }],
        subject: "Order Confirmation - Intare Pharmacy",
        htmlContent: `
          <h2>Order Confirmed!</h2>
          <p>Dear ${customerName},</p>
          <p>Your order for ${purchase.medicineName} has been received.</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            <li>Medicine: ${purchase.medicineName}</li>
            <li>Quantity: ${quantity}</li>
            <li>Total: $${purchase.totalPrice}</li>
          </ul>
          <p>Thank you for choosing Intare Pharmacy!</p>
        `
      };
      
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_SMTP_KEY
        },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        console.log('✅ Email sent successfully!');
      } else {
        const errorData = await response.json();
        console.log('❌ Email failed:', errorData);
      }
    } catch (emailError) {
      console.log('❌ Email error occurred:', emailError.message);
    }
    
    res.status(201).json({ message: "Purchase successful", purchase });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const purchase = await Purchase.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    
    // Send email notification
    try {
      const statusMessages = {
        confirmed: 'Your order has been confirmed and will be delivered soon.',
        delivered: 'Your order has been successfully delivered. Thank you!',
        failed: 'Unfortunately, your order could not be processed. Please contact us.'
      };
      
      const emailData = {
        sender: {
          name: "Intare Pharmacy",
          email: process.env.FROM_EMAIL
        },
        to: [{
          email: purchase.customerEmail,
          name: purchase.customerName
        }],
        subject: `Order ${status.charAt(0).toUpperCase() + status.slice(1)} - Intare Pharmacy`,
        htmlContent: `
          <h2>Order ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
          <p>Dear ${purchase.customerName},</p>
          <p>${statusMessages[status]}</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            <li>Order ID: #${purchase._id.toString().slice(-8).toUpperCase()}</li>
            <li>Medicine: ${purchase.medicineName}</li>
            <li>Status: ${status.toUpperCase()}</li>
          </ul>
          <p>Best regards,<br>Intare Pharmacy Team</p>
        `
      };
      
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_SMTP_KEY
        },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        console.log('✅ Status update email sent to:', purchase.customerEmail);
      } else {
        const errorData = await response.json();
        console.log('❌ Email failed:', errorData);
      }
    } catch (emailError) {
      console.log('❌ Email sending failed:', emailError.message);
    }
    
    res.json({ message: "Status updated successfully", purchase });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};