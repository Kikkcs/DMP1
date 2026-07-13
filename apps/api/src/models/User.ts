import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    otp?: string;
    otpExpiry?: Date;
    otpVerified: boolean;
    isSubscribed: boolean;
    subscriptionPlan: 'none' | 'monthly' | 'yearly';
    subscriptionExpiry?: Date;
    savedArticles: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        otp: { type: String },
        otpExpiry: { type: Date },
        otpVerified: { type: Boolean, default: false },
        isSubscribed: { type: Boolean, default: false },
        subscriptionPlan: {
            type: String,
            enum: ['none', 'monthly', 'yearly'],
            default: 'none',
        },
        subscriptionExpiry: { type: Date },
        savedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
