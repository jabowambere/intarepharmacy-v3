import nodemailer from "nodemailer";

export const testEmail = async (req, res) => {
  try {
    console.log('🔧 Creating test email account...');
    
    // Create a test account with Ethereal Email
    const testAccount = await nodemailer.createTestAccount();
    console.log('✅ Test account created:', testAccount.user);
    
    const transporter = nodemailer.createTransporter({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: '"Intare Pharmacy Test" <test@intarepharmacy.com>',
      to: 'customer@example.com',
      subject: 'Email Test - Intare Pharmacy',
      html: `
        <h2>Email Test Successful!</h2>
        <p>This is a test email from Intare Pharmacy system.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>If you can see this, email functionality is working!</p>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Email test failed',
      error: error.message 
    });
  }
};