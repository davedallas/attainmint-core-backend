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
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const dotenv = require('dotenv');
const user_model_1 = __importDefault(require("../models/user.model"));
dotenv.config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK,
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const password = profile.password;
        const user = {
            email,
            name,
            password
        };
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return done(null, existingUser);
        }
        else {
            const newUser = yield new user_model_1.default(user).save();
            return done(null, newUser);
        }
    });
}));
