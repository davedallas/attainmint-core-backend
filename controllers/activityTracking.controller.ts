import { Request, Response } from 'express';
import { DailyTracking } from '../models/dailyTracking.model';
import { PlatformActivity } from '../models/platformActivity.model';

interface ActivityStats {
    daily: {
        email: number;
        call: number;
        meeting: number;
        connection: number;
        message: number;
    };
    weekly: {
        email: number;
        call: number;
        meeting: number;
        connection: number;
        message: number;
    };
    monthly: {
        email: number;
        call: number;
        meeting: number;
        connection: number;
        message: number;
    };
}

interface DailyRequest {
    email: number;
    call: number;
    meeting: number;
    connection: number;
    message: number;
    profileView: number;
}

export const trackActivity = async (req: Request, res: Response) => {
    try {
        const { call, connection, email, meeting, message , profileView  } = req.body as DailyRequest;
        // Create new daily tracking record
        const dailyActivity = new DailyTracking({
            call,
            connection,
            email,
            meeting,
            message,
            profileView
        });
        console.log("dailyActivity:", dailyActivity);
        // Save to database
        const savedActivity = await dailyActivity.save();
        console.log('Saved activity:', savedActivity);
        res.status(200).json({ 
            message: 'Activity tracked successfully',
            data: savedActivity
        });
    } catch (error) {
        console.error('Error tracking activity:', error);
        res.status(500).json({ error: 'Failed to track activity' });
    }
};

export const platformActivity = async (req: Request, res: Response) => {
    try {
        const { linkedin, salesforce, gmail, hubspot, userInfo } = req.body;

        // Create new platform activity record
        const platformActivityData = new PlatformActivity({
            linkedin,
            salesforce,
            gmail,
            hubspot,
            userInfo
        });
        console.log("platformActivityData:", platformActivityData);
        // Save to database
        const savedPlatformActivity = await platformActivityData.save();
        
        console.log('Saved platform activity:', savedPlatformActivity);

        res.status(200).json({
            message: 'Platform activity tracked successfully',
            data: savedPlatformActivity
        });
    } catch (error) {
        console.error('Error tracking platform activity:', error);
        res.status(500).json({ error: 'Failed to track platform activity' });
    }
};

export const getActivityLogs = async (req: Request, res: Response) => {
    try {
        // Implement fetching activity logs logic here
        res.status(200).json({ logs: [] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
};