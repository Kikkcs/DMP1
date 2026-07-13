import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
    title: string;
    slug: string;
    coverImage: string;
    excerpt: string;
    content: string;
    author: string;
    category: 'Technology' | 'Culture' | 'Science' | 'Business' | 'Health';
    tags: string[];
    isPremium: boolean;
    publishDate: Date;
    readingTimeMins: number;
    views: number;
}

const ArticleSchema = new Schema<IArticle>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        coverImage: { type: String, required: true },
        excerpt: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ['Technology', 'Culture', 'Science', 'Business', 'Health'],
        },
        tags: [{ type: String }],
        isPremium: { type: Boolean, default: false },
        publishDate: { type: Date, default: Date.now },
        readingTimeMins: { type: Number, default: 5 },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

ArticleSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ isPremium: 1 });
ArticleSchema.index({ publishDate: -1 });

export default mongoose.model<IArticle>('Article', ArticleSchema);
