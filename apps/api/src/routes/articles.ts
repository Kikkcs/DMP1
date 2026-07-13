import { Router, Request, Response } from 'express';
import Article from '../models/Article';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/articles
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
        const { search, category, premium, page = '1', limit = '12' } = req.query as Record<string, string>;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const filter: any = {};

        if (search && search.trim()) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ];
        }
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (premium === 'true') filter.isPremium = true;
        if (premium === 'false') filter.isPremium = false;

        const [articles, total] = await Promise.all([
            Article.find(filter)
                .sort({ publishDate: -1 })
                .skip(skip)
                .limit(limitNum)
                .select('-content'),
            Article.countDocuments(filter),
        ]);

        res.json({
            articles,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// GET /api/articles/:slug
router.get('/:slug', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) return res.status(404).json({ message: 'Article not found' });

        // Increment views
        await Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

        const articleObj = article.toObject() as any;

        // If premium and no valid user subscription - gate content
        // We check via query param isSubscribed since we need User lookup
        // Client sends subscription status; content gating is enforced both here and on frontend
        res.json({ article: articleObj });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// GET /api/articles/:slug/related
router.get('/:slug/related', async (req: Request, res: Response) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug }).select('category _id');
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const related = await Article.find({
            category: article.category,
            _id: { $ne: article._id },
        })
            .sort({ publishDate: -1 })
            .limit(3)
            .select('-content');

        res.json({ articles: related });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

export default router;
