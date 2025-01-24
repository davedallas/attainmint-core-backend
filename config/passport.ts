const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const dotenv = require('dotenv');
import User from "../models/user.model";
dotenv.config();

passport.use(new GoogleStrategy(
    {
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL : process.env.GOOGLE_AUTH_CALLBACK,
        passReqToCallback: true
    } ,
    async function(request:any , accessToken:any , refreshToken:any , profile:any , done:any){
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const password = profile.password
        const user = {
            email,
            name,
            password
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return done(null , existingUser);
        }
        else{
            const newUser = await new User(user).save();
            return done(null , newUser);
        }
    }
));
