import mongoose, { Document, Schema } from 'mongoose';

interface IPlatformActivity extends Document {
    linkedin: number;
    salesforce: number;
    gmail: number;
    hubspot: number;
    userInfo: number;
    createdAt: Date;
}

const PlatformActivitySchema = new Schema<IPlatformActivity>({
    linkedin: { type: Number, required: true, default: 0 },
    salesforce: { type: Number, required: true, default: 0 },
    gmail: { type: Number, required: true, default: 0 },
    hubspot: { type: Number, required: true, default: 0 },
    userInfo: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Create index on createdAt
PlatformActivitySchema.index({ createdAt: -1 });

export const PlatformActivity = mongoose.model<IPlatformActivity>('PlatformActivity', PlatformActivitySchema); 