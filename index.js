"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session = require('express-session');
const userModel = require('./models/user.model');
const dotenv_1 = __importDefault(require("dotenv"));
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
require('./config/dbConnect');
//For env File 
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: "*",
    credentials: true
}));
// parse request bodies
app.use(express_1.default.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('./config/passport');
app.use('/api/auth', auth_routes_1.default);
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
    }
    catch (error) {
        return done(error);
    }
})));
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(`${process.env.Redirection_URL}`);
});
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
