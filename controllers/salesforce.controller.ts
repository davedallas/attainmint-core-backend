import dotenv from 'dotenv'
import { Connection , OAuth2 } from 'jsforce';

dotenv.config()

export const getDataFromSalesforce = async () =>{
  try {

    const oauth2 = new OAuth2({
      clientId: process.env.SFROCE_CLIENT_ID,
      clientSecret: process.env.SFROCE_CLIENT_SECRET,
      redirectUri: process.env.SFROCE_REDIRECT_URI
    });

    const authUrl = oauth2.getAuthorizationUrl();
    console.log('Open the following URL and grant access to your Salesforce account:');
    console.log(authUrl);

    const conn = new Connection({
      oauth2: oauth2
    })

    const username = ""
    const password = ""

    // const userInfor = await conn.login(username, password);

    // console.log('Successfully authenticated with Salesforce');
    // console.log('userID:' + userInfor.id);
    // console.log('Org ID:' + userInfor.organizationId);
    // return conn;

    return 'ok'
  } catch(e){
    console.log(e)
  }
}