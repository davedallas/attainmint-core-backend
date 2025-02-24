import express from 'express';
import salesforceController from '../controllers/salesforce.controller';

const router = express.Router();

router.get('/install', salesforceController.install);
router.get('/callback', salesforceController.callback);

export default router;