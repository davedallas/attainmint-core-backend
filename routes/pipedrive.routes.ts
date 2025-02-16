import express from 'express';
import { installPipedrive, handleCallback } from '../controllers/pipedrive.controller';

const router = express.Router();

router.get('/install', installPipedrive);
router.get('/callback', handleCallback);

export default router;