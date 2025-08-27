import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import transporter from '../utils/emailTransporter.js';

const router = express.Router();

// Send verification code to email (real email logic)
router.post('/send-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  // Always generate a unique code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  try {
    await transporter.sendMail({
      from: 'nationofaura@gmail.com', // app admin sender
      to: email, // receiver from sign up form
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px; border-radius: 12px; max-width: 400px; margin: auto;">
          <h2 style="color: #3b82f6; text-align: center; margin-bottom: 16px;">Welcome to GlassTask!</h2>
          <p style="font-size: 16px; color: #333; text-align: center;">Your verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #10b981; background: #e0f7fa; padding: 16px; border-radius: 8px; text-align: center; margin: 16px 0; letter-spacing: 8px;">${code}</div>
          <p style="font-size: 15px; color: #555; text-align: center;">Enter this code in the app to verify your email and get started.<br><br>If you did not request this, you can ignore this email.</p>
          <div style="text-align: center; margin-top: 24px;">
            <img src="https://raw.githubusercontent.com/shkelqimkajtazaj/glasstask/main/public/assets/images/no_image.png" alt="GlassTask Logo" style="width: 48px; height: 48px; border-radius: 8px; margin-bottom: 8px;" />
            <div style="font-size: 13px; color: #aaa;">GlassTask &copy; 2025</div>
          </div>
        </div>
      `,
    });
    res.json({ message: 'Verification code sent to email.', code });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: user not found for email', email);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Login attempt:', { email, password, dbHash: user.password });
    const valid = await bcrypt.compare(password, user.password);
    console.log('Bcrypt compare result:', valid);
    if (!valid) {
      console.log('Login failed: invalid credentials for email', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    console.log('Login error:', err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
