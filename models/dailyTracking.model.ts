import mongoose, { Document, Schema } from 'mongoose';

// Interface for the document
interface IDailyTracking extends Document {
    email: number;
    call: number;
    meeting: number;
    connection: number;
    message: number;
    profileView: number;
    createdAt: Date;
}

// Schema definition
const DailyTrackingSchema = new Schema<IDailyTracking>({
    email: { 
        type: Number, 
        required: true,
        default: 0
    },
    call: { 
        type: Number, 
        required: true,
        default: 0
    },
    meeting: { 
        type: Number, 
        required: true,
        default: 0
    },
    connection: { 
        type: Number, 
        required: true,
        default: 0
    },
    message: { 
        type: Number, 
        required: true,
        default: 0
    },
    profileView: { 
        type: Number, 
        required: true,
        default: 0
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Create indexes for better query performance
DailyTrackingSchema.index({ createdAt: -1 });

// Export the model
export const DailyTracking = mongoose.model<IDailyTracking>('DailyTracking', DailyTrackingSchema); 