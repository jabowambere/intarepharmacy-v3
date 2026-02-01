import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Save to database
    const contact = new Contact({ name, email, message });
    await contact.save();
    
    // Send email notification using Brevo API
    try {
      const emailData = {
        sender: {
          name: "Intare Pharmacy",
          email: process.env.FROM_EMAIL
        },
        to: [{
          email: email,
          name: name
        }],
        subject: "Thank you for contacting Intare Pharmacy",
        htmlContent: `
          <h2>Thank you for your message!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <p><em>"${message}"</em></p>
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
        console.log('✅ Contact form email sent successfully');
      } else {
        const errorData = await response.json();
        console.log('❌ Contact email failed:', errorData);
      }
    } catch (emailError) {
      console.log('❌ Email sending failed:', emailError.message);
    }
    
    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};