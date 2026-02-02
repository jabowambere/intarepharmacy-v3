import Appointment from "../models/Appointment.js";

// CREATE appointment
export const createAppointment = async (req, res) => {
  try {
    console.log('📅 Creating appointment with data:', req.body);
    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();
    console.log('✅ Appointment saved:', savedAppointment);

    // Send confirmation email
    try {
      const emailData = {
        sender: {
          name: "Intare Pharmacy",
          email: process.env.FROM_EMAIL
        },
        to: [{
          email: savedAppointment.email,
          name: savedAppointment.patientName
        }],
        subject: "Appointment Booked - Intare Pharmacy",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Appointment Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">🏥 Intare Pharmacy</h1>
                <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px;">Appointment Confirmation</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ⏳ Pending Review
                  </div>
                </div>
                
                <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Hello ${savedAppointment.patientName}!</h2>
                <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                  Thank you for booking an appointment with Intare Pharmacy. We have received your request and our team will review it shortly. You will receive another email once your appointment is confirmed.
                </p>
                
                <!-- Appointment Details Card -->
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 30px 0;">
                  <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">📅 Appointment Details</h3>
                  <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Date</span>
                      <span style="color: #1f2937; font-weight: 600;">${new Date(savedAppointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Time</span>
                      <span style="color: #1f2937; font-weight: 600;">${savedAppointment.appointmentTime}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Consultation Type</span>
                      <span style="color: #1f2937; font-weight: 600;">${savedAppointment.consultationType}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="color: #6b7280; font-size: 14px;">Status</span>
                      <span style="color: #f59e0b; font-weight: 700; text-transform: uppercase;">PENDING</span>
                    </div>
                  </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <h4 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">⏰ What's Next?</h4>
                  <ul style="color: #a16207; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                    <li>Our team will review your appointment request</li>
                    <li>You'll receive a confirmation email within 24 hours</li>
                    <li>If confirmed, please arrive 10 minutes early</li>
                    <li>Bring valid ID and any relevant medical documents</li>
                  </ul>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px;">Need to make changes? Contact us anytime</p>
                <div style="margin-bottom: 20px;">
                  <a href="tel:+1234567890" style="color: #667eea; text-decoration: none; margin: 0 15px; font-weight: 500;">📞 Call Us</a>
                  <a href="mailto:appointments@intarepharmacy.com" style="color: #667eea; text-decoration: none; margin: 0 15px; font-weight: 500;">📧 Email Us</a>
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
        console.log('✅ Appointment booking email sent to:', savedAppointment.email);
      } else {
        const errorData = await response.json();
        console.log('❌ Appointment booking email failed:', errorData);
      }
    } catch (emailError) {
      console.log('❌ Appointment booking email sending failed:', emailError.message);
    }

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error('❌ Error creating appointment:', error);
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// GET all appointments
export const getAppointments = async (req, res) => {
  try {
    console.log('📅 Getting appointments from database...');
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    console.log('📅 Found appointments:', appointments.length);
    console.log('📅 Appointments data:', appointments);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// UPDATE appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Email functionality disabled - account needs activation
    console.log(`📧 Appointment email: ${status} appointment for ${appointment.patientName}`);
    /*
      const emailData = {
        sender: {
          name: "Intare Pharmacy",
          email: process.env.FROM_EMAIL
        },
        to: [{
          email: appointment.email,
          name: appointment.patientName
        }],
        subject: `Appointment ${status} - Intare Pharmacy`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Appointment Update</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, ${status === 'Confirmed' ? '#10b981, #059669' : '#ef4444, #dc2626'}); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">🏥 Intare Pharmacy</h1>
                <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px;">Appointment Update</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; background-color: ${status === 'Confirmed' ? '#10b981' : '#ef4444'}; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${status === 'Confirmed' ? '✓ Confirmed' : '⚠️ Cancelled'}
                  </div>
                </div>
                
                <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Hello ${appointment.patientName}!</h2>
                <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                  ${status === 'Confirmed' 
                    ? 'Great news! Your appointment has been confirmed. We look forward to seeing you at our pharmacy.' 
                    : 'We regret to inform you that your appointment has been cancelled. Please contact us to reschedule at your convenience.'}
                </p>
                
                <!-- Appointment Details Card -->
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 30px 0;">
                  <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">📅 Appointment Details</h3>
                  <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Date</span>
                      <span style="color: #1f2937; font-weight: 600;">${new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Time</span>
                      <span style="color: #1f2937; font-weight: 600;">${appointment.appointmentTime}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Consultation Type</span>
                      <span style="color: #1f2937; font-weight: 600;">${appointment.consultationType}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="color: #6b7280; font-size: 14px;">Status</span>
                      <span style="color: ${status === 'Confirmed' ? '#10b981' : '#ef4444'}; font-weight: 700; text-transform: uppercase;">${status}</span>
                    </div>
                  </div>
                </div>
                
                ${status === 'Confirmed' ? `
                <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <h4 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">📍 What to Bring</h4>
                  <ul style="color: #1d4ed8; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                    <li>Valid ID or insurance card</li>
                    <li>List of current medications</li>
                    <li>Any relevant medical documents</li>
                    <li>Prescription if applicable</li>
                  </ul>
                </div>
                
                <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
                  <h4 style="color: #065f46; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">🕰️ Reminder</h4>
                  <p style="color: #047857; margin: 0; font-size: 14px;">Please arrive 10 minutes early for check-in. If you need to reschedule, contact us at least 24 hours in advance.</p>
                </div>
                ` : `
                <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <h4 style="color: #991b1b; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">📞 Reschedule Your Appointment</h4>
                  <p style="color: #b91c1c; margin: 0 0 12px 0; font-size: 14px;">We apologize for any inconvenience. Our team is ready to help you find a new appointment time that works for you.</p>
                  <p style="color: #b91c1c; margin: 0; font-size: 14px; font-weight: 500;">Call us or visit our pharmacy to book a new appointment.</p>
                </div>
                `}
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px;">Need to make changes? Contact us anytime</p>
                <div style="margin-bottom: 20px;">
                  <a href="tel:+1234567890" style="color: #667eea; text-decoration: none; margin: 0 15px; font-weight: 500;">📞 Call Us</a>
                  <a href="mailto:appointments@intarepharmacy.com" style="color: #667eea; text-decoration: none; margin: 0 15px; font-weight: 500;">📅 Reschedule</a>
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
        console.log('✅ Appointment email sent to:', appointment.email);
      } else {
        const errorData = await response.json();
        console.log('❌ Appointment email failed:', errorData);
      }
    */
    
    res.json({ message: 'Appointment status updated successfully', appointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
