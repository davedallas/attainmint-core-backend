import { Router } from 'express';
import { Install , OauthCallback } from '../controllers/hubspot.controller';

const router = Router();

router.get('/install', Install);
router.get('/oauth-callback', OauthCallback);

export default router;