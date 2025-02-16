import { Client as HubspotClient } from '@hubspot/api-client';
import axios from 'axios';
import { URLSearchParams } from 'url';

const CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI;
const SCOPES = "crm.objects.contacts.read";

export const Install = (req: any, res: any) => {
  const hubspotClient = new HubspotClient();

  if (!CLIENT_ID || !REDIRECT_URI) {
    return res.status(500).send("Missing CLIENT_ID or REDIRECT_URI");
  }

  const uri = hubspotClient.oauth.getAuthorizationUrl(
    CLIENT_ID,
    REDIRECT_URI,
    SCOPES
  );
  
  res.redirect(uri);
};

export const OauthCallback = async (req: any, res: any) => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !req.query.code || typeof req.query.code !== 'string') {
      throw new Error('Missing required parameters');
    }

    const payload = {
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: req.query.code,
    };

    const params = new URLSearchParams(payload);
    const { data } = await axios.post(
      "https://api.hubapi.com/oauth/v1/token",
      params
    );

    const hubspotClient = new HubspotClient({
      accessToken: data.access_token,
    });

    const result = await hubspotClient.crm.contacts.getAll();
    
    // Redirect to frontend with the result data
    res.redirect(`http://localhost:3000?data=${encodeURIComponent(JSON.stringify(result))}`);
  } catch (error) {
    res.redirect(`http://localhost:3000?error=${encodeURIComponent(error instanceof Error ? error.message : 'An unknown error occurred')}`);
  }
};