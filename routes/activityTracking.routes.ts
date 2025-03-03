import express from 'express';
import { trackActivity, getActivityLogs , platformActivity} from '../controllers/activityTracking.controller';

const router = express.Router();

router.post('/track', trackActivity);
router.get('/logs', getActivityLogs);
router.post('/platformActivity', platformActivity);

export default router;