import { Router, Response } from 'express';
import User from '../models/User';
import Article from '../models/Article';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId).populate('savedArticles', '-content').select('-passwordHash -otp -otpExpiry');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// PUT /api/users/me
router.put('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { name, email } = req.body;
        const updates: any = {};
        if (name) updates.name = name.trim();
        if (email) updates.email = email.toLowerCase().trim();

        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true })
            .select('-passwordHash -otp -otpExpiry');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// POST /api/users/save/:articleId
router.post('/save/:articleId', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const article = await Article.findById(req.params.articleId);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $addToSet: { savedArticles: req.params.articleId } },
            { new: true }
        ).select('-passwordHash -otp');
        res.json({ message: 'Article saved', savedArticles: user?.savedArticles });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// DELETE /api/users/save/:articleId
router.delete('/save/:articleId', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $pull: { savedArticles: req.params.articleId } },
            { new: true }
        ).select('-passwordHash -otp');
        res.json({ message: 'Article unsaved', savedArticles: user?.savedArticles });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// POST /api/users/subscribe
router.post('/subscribe', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { plan } = req.body; // 'monthly' | 'yearly'
        if (!['monthly', 'yearly'].includes(plan)) {
            return res.status(400).json({ message: 'Invalid plan. Choose monthly or yearly.' });
        }
        const expiry = new Date();
        if (plan === 'monthly') {
            expiry.setMonth(expiry.getMonth() + 1);
        } else {
            expiry.setFullYear(expiry.getFullYear() + 1);
        }
        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                isSubscribed: true,
                subscriptionPlan: plan,
                subscriptionExpiry: expiry,
            },
            { new: true }
        ).select('-passwordHash -otp');
        res.json({ message: 'Subscription activated', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

export default router;
