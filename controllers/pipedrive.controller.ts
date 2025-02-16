const pipedrive = require('pipedrive');

const clientId = process.env.PIPE_CLIENT_ID;
const clientSecret = process.env.PIPE_CLIENT_SECRET;
const redirectUri = process.env.PIPE_CALL_BACK_URL;

const oauth2 = new pipedrive.v1.OAuth2Configuration({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri
});

export const installPipedrive = async (req: any, res: any) => {
  try {
    const token = oauth2.updateToken(req.session?.accessToken);

    if (!token) {
      const authUrl = oauth2.authorizationUrl;
      return res.redirect(authUrl);
    }

    const apiConfig = new pipedrive.v1.Configuration({
      accessToken: oauth2.getAccessToken,
      basePath: oauth2.basePath,
    });

    const dealsApi = new pipedrive.v1.DealsApi(apiConfig);
    const response = await dealsApi.getDeals();
    const { data: deals } = response;

    return res.send(deals);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const handleCallback = async (req: any, res: any) => {
  try {
    const authCode = req.query.code;
    const newAccessToken = await oauth2.authorize(authCode);

    req.session.accessToken = newAccessToken;
    res.redirect(`http://localhost:3000?pipedrive=${encodeURIComponent(JSON.stringify(authCode))}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};