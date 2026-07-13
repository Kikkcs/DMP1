import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'luminary_secret';

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        const user = await User.create({ name, email, passwordHash, otp, otpExpiry });
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, otpVerified: user.otpVerified, isSubscribed: user.isSubscribed, subscriptionPlan: user.subscriptionPlan },
            otp, // return otp for mock purposes
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                otpVerified: user.otpVerified,
                isSubscribed: user.isSubscribed,
                subscriptionPlan: user.subscriptionPlan,
                subscriptionExpiry: user.subscriptionExpiry,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Accept 123456 or any 6-digit code
        const isValid = otp === '123456' || /^\d{6}$/.test(otp);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP format' });
        }
        user.otpVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.json({ message: 'OTP verified successfully', otpVerified: true });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req: Request, res: Response) => {
    // Mock: always return success
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    res.json({ message: 'If this email exists, a reset link has been sent.' });
});

export default router;
