import express, { Express, Request, Response , Application } from 'express';
const session = require('express-session');
const userModel = require('./models/user.model');
import dotenv from 'dotenv';
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const authRouter = require('./routes/auth.routes');


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
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('./config/passport');

app.get('/api/auth', authRouter)


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
    res.redirect('http://localhost:3000/');
  }
)

passport.serializeUser(function(user:any, done:any) {
  done(null, user);
});

passport.deserializeUser(function(user:any, done:any) {
  done(null, user);
});

const mongodbURL = process.env.MONGODB_URL;
mongoose.connect(mongodbURL)
  .then(() => {
    console.log(`Connected to MongoDB ${mongodbURL}`);
  })
  .catch((error:any) => {
    console.error('Error connecting to MongoDB:', error);
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});