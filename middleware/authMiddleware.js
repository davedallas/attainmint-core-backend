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
const jwt = require('jsonwebtoken');
const user_model_1 = __importDefault(require("../models/user.model"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new Error('Authentication failed. Token missing.');
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = yield user_model_1.default.findOne({
            _id: decoded._id,
            'tokens.token': token,
        });
        if (!user) {
            throw new Error('Authentication failed. User not found.');
        }
        req.user = user;
        req.token = token;
        next();
    }
    catch (error) {
        res.status(401).send({ error: 'Authentication failed.' });
    }
});
exports.default = auth;
