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
exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const signup = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = user;
    if (!name || !email || !password) {
        return {
            error: 'Please provide all the required fields',
        };
    }
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        return {
            error: 'User with that email already exists.',
        };
    }
    const newUser = new user_model_1.default({ name, email, password });
    yield newUser.save();
    const token = yield newUser.generateAuthToken();
    return {
        user: newUser,
        token,
    };
});
exports.signup = signup;
const login = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = user;
    if (!email || !password) {
        return {
            error: 'Please provide all the required fields',
        };
    }
    const existingUser = yield user_model_1.default.findByCredentials(email, password);
    if (!existingUser) {
        return null;
    }
    const token = yield existingUser.generateAuthToken();
    return {
        user: existingUser,
        token,
    };
});
exports.login = login;
