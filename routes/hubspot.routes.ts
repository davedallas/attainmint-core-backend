import express from "express";
import dotenv from "dotenv";
import { getDataFromHubspot } from "../controllers/hubspot.controller";
const hubspot = require('@hubspot/api-client')

dotenv.config()

const clientId = process.env.HUBSPOT_CLIENT_ID
const clientSecret = process.env.HUBSPOT_CLIENT_SECRET
const router = express.Router();

router.post('/getData', async (req: any, res: any) => {
  try {
    const data = await getDataFromHubspot();
    const hubspotClient = new hubspot({ clientId, clientSecret })
    const uri = hubspotClient.oauth.getAuthorizationUrl(
      process.env.CLIENT_ID,
      process.env.REDIRECT_URI,
      "crm.objects.contacts.write"
    );

    res.redirect(uri)
    // res.status(200).json({data})
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
})



export default router;