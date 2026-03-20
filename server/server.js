/* ============================================================
   FlicksByNick — Backend Server
   Email Service with Express & Nodemailer
   ============================================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

/* ── Middleware ── */
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Email Transporter Configuration ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/* ── Verify connection ── */
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

/* ── Routes ── */

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required (name, email, message)'
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email address'
    });
  }

  try {
    // Email to you (photographer)
    const mailOptionsToPhotographer = {
      from: process.env.EMAIL_USER,
      to: 'ncarmichael903@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E8B84B;">New Inquiry from FlicksByNick Website</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            This email was sent from your FlicksByNick contact form.
          </p>
        </div>
      `
    };

    // Confirmation email to user
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your inquiry',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E8B84B;">Thank you, ${name}!</h2>
          <p>We received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666;">Best regards,<br>Nick | FlicksByNick Photography</p>
        </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptionsToPhotographer),
      transporter.sendMail(mailOptionsToUser)
    ]);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully! We will be in touch soon.'
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.'
    });
  }
});

/* ── Error handling ── */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
});

/* ── Start server ── */
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   FlicksByNick Backend Server          ║
║   Running on http://localhost:${PORT}   ║
╚════════════════════════════════════════╝
  `);
});
