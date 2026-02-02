export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const emailData = {
      sender: {
        name: "Intare Pharmacy",
        email: process.env.FROM_EMAIL
      },
      to: [{
        email: to,
        name: to.split('@')[0]
      }],
      subject: subject,
      htmlContent: htmlContent
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
      console.log('✅ Email sent successfully to:', to);
      return true;
    } else {
      const errorData = await response.json();
      console.log('❌ Email failed:', errorData);
      return false;
    }
  } catch (error) {
    console.log('❌ Email error:', error.message);
    return false;
  }
};