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
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">🏥 Intare Pharmacy</h1>
                <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px;">Your trusted healthcare partner</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">✓ Order Confirmed</div>
                </div>
                
                <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Thank you, ${customerName}!</h2>
                <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">Your order has been successfully received and is being processed. We'll notify you once it's ready for delivery.</p>
                
                <!-- Order Details Card -->
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 30px 0;">
                  <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">📋 Order Details</h3>
                  <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Medicine</span>
                      <span style="color: #1f2937; font-weight: 600;">${purchase.medicineName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Quantity</span>
                      <span style="color: #1f2937; font-weight: 600;">${quantity} units</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="color: #6b7280; font-size: 14px;">Total Amount</span>
                      <span style="color: #059669; font-weight: 700; font-size: 18px;">$${purchase.totalPrice}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Next Steps -->
                <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <h4 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">📦 What's Next?</h4>
                  <ul style="color: #b45309; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                    <li>We'll prepare your order within 2-4 hours</li>
                    <li>You'll receive an SMS when ready for pickup/delivery</li>
                    <li>Our team will contact you for delivery arrangements</li>
                  </ul>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px;">Need help? Contact us anytime</p>
                <div style="margin-bottom: 20px;">
                  <a href="tel:+1234567890" style="color: #667eea; text-decoration: none; margin: 0 15px; font-weight: 500;">📞 Call Us</a>
                  <a href="mailto:support@intarepharmacy.com" style="color: #667eea; text-decoration: none; margin: 0 15px; font-weight: 500;">✉️ Email</a>
                </div>
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">© 2024 Intare Pharmacy. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
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
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Update</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, ${status === 'confirmed' ? '#10b981, #059669' : status === 'delivered' ? '#3b82f6, #1d4ed8' : '#ef4444, #dc2626'}); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">🏥 Intare Pharmacy</h1>
                <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px;">Order Status Update</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; background-color: ${status === 'confirmed' ? '#10b981' : status === 'delivered' ? '#3b82f6' : '#ef4444'}; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${status === 'confirmed' ? '✓ Confirmed' : status === 'delivered' ? '📦 Delivered' : '⚠️ Failed'}
                  </div>
                </div>
                
                <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Hello ${purchase.customerName}!</h2>
                <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">${statusMessages[status]}</p>
                
                <!-- Order Details Card -->
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 30px 0;">
                  <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">📋 Order Summary</h3>
                  <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Order ID</span>
                      <span style="color: #1f2937; font-weight: 600; font-family: monospace;">#${purchase._id.toString().slice(-8).toUpperCase()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Medicine</span>
                      <span style="color: #1f2937; font-weight: 600;">${purchase.medicineName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="color: #6b7280; font-size: 14px;">Status</span>
                      <span style="color: ${status === 'confirmed' ? '#10b981' : status === 'delivered' ? '#3b82f6' : '#ef4444'}; font-weight: 700; text-transform: uppercase;">${status}</span>
                    </div>
                  </div>
                </div>
                
                ${status === 'delivered' ? `
                <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
                  <h4 style="color: #065f46; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">🎉 Thank You!</h4>
                  <p style="color: #047857; margin: 0; font-size: 14px;">We hope our service met your expectations. Feel free to reach out if you need anything else!</p>
                </div>
                ` : status === 'failed' ? `
                <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <h4 style="color: #991b1b; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">📞 Need Assistance?</h4>
                  <p style="color: #b91c1c; margin: 0; font-size: 14px;">Please contact our support team to resolve this issue or place a new order.</p>
                </div>
                ` : ''}
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px;">Questions? We're here to help!</p>
                <div style="margin-bottom: 20px;">
                  <a href="tel:+1234567890" style="color: #667eea; text-decoration: none; margin: 0 15px; font-weight: 500;">📞 Call Us</a>
                  <a href="mailto:support@intarepharmacy.com" style="color: #667eea; text-decoration: none; margin: 0 15px; font-weight: 500;">✉️ Email</a>
                </div>
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">© 2024 Intare Pharmacy. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
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