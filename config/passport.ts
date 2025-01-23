const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

passport.use(new GoogleStrategy(
    {
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL : "http://localhost:8000/auth/google/callback",
        passReqToCallback: true
    } ,
    function(request:any , accessToken:any , refreshToken:any , profile:any , done:any){
        return done(null , profile);
    }
));
