import express, { Express, Request, Response , Application } from 'express';
const session = require('express-session');
const userModel = require('./models/user.model');
import dotenv from 'dotenv';
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
import authRouter from './routes/auth.routes';
import salesforceRouter from './routes/salesforce.routes';
import hubspotRouter from './routes/hubspot.routes';
require('./config/dbConnect')

//For env File 
dotenv.config();

const app: Application = express();
app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : true,
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(cors(
  {
    origin: "*",
    credentials : true
  }
));
// parse request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('./config/passport');

app.use('/api/auth', authRouter)
app.use('/api/salesforce' , salesforceRouter)
app.use('/api/hubspot' , hubspotRouter);


passport.use(
  new LocalStrategy(
    {usernameField: 'email'},
    async (email:String, password:String, done:any) => {
      try{
        const user = await userModel.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        
      } catch (error) {
        return done(error);
      }
    }
  )
)

app.get('/auth/google' , 
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${process.env.Redirection_URL}`);
  }
)
passport.serializeUser(function(user:any, done:any) {
  done(null, user);
});

passport.deserializeUser(function(user:any, done:any) {
  done(null, user);
});










// Hubspot integration



const hubspot =  require("@hubspot/api-client");
const url  = require("url");
const axios = require("axios")

const CLIENT_ID = process.env.HUBSPOT_CLIENT_ID
const CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET 
let REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI
const SCOPES = "crm.objects.contacts.read";

app.get("/install", (req:any, res:any) => {
  const hubspotClient = new hubspot.Client();
  
  if (CLIENT_ID && REDIRECT_URI) {
    const uri = hubspotClient.oauth.getAuthorizationUrl(
      CLIENT_ID,
      REDIRECT_URI,
      SCOPES
    );
    res.redirect(uri);
  } else {
    res.status(500).send("Missing CLIENT_ID or REDIRECT_URI");
  }
});

app.get("/oauth-callback", async (req:any, res:any) => {
  console.log('req--->', req.query.code)
  // here we create a payload as prescribed by HubSpot for the token exchange where our app exchanges the temporary authorization code for an access token that can be used to call HubSpot APIs
  const payload = {
    grant_type: "authorization_code",
    client_id: CLIENT_ID || '',
    client_secret: CLIENT_SECRET || '',
    redirect_uri: REDIRECT_URI || '',
    code: req.query.code,
  };

  const params = new url.URLSearchParams(payload);

  // we are using the rest api method here to exchange the tokens
  const apiResponse = await axios.post(
    "https://api.hubapi.com/oauth/v1/token",
    params.toString()
  );

  console.log('token--->', apiResponse.data.access_token)

// once we receive the access token we can instantiate a hubspot client using the official client library and reuse it across the codebase for our own convenience
  const hubspotClient = new hubspot.Client({
    accessToken: apiResponse.data.access_token,
  });

  // this will create a contact in the hubspot crm of the user who installs our app with firstname and lastname as declared above
  // await hubspotClient.crm.contacts.basicApi.create(dummyContact);
  const result = await hubspotClient.crm.contacts.getAll()
  console.log(result)
  return res.send(result);
})












const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});




