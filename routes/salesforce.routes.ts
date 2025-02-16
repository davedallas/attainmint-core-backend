import express from 'express';
import { getDataFromSalesforce } from '../controllers/salesforce.controller';

const router = express.Router();

router.post('/getData', async (req: any, res: any) => {
  try {
    const data = await getDataFromSalesforce();
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});
export default router;