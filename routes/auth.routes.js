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
const user_controller_1 = require("../controllers/user.controller");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    const registeredUser = yield (0, user_controller_1.signup)(userData);
    if (registeredUser.error) {
        return res.status(400).json({
            error: registeredUser.error,
        });
    }
    return res.status(201).json(registeredUser);
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        email: req.body.email,
        password: req.body.password,
    };
    const loggedInUser = yield (0, user_controller_1.login)(userData);
    if (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.error) {
        return res.status(400).json({
            error: loggedInUser.error,
        });
    }
    return res.status(200).json(loggedInUser);
}));
// Fetch logged in user
router.get('/me', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        user: req.user,
    });
}));
// Logout user
router.post('/logout', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        yield req.user.save();
    }
    return res.status(200).json({
        message: 'User logged out successfully.',
    });
}));
// Logout user from all devices
router.post('/logoutall', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        req.user.tokens = [];
        yield req.user.save();
    }
    return res.status(200).json({
        message: 'User logged out from all devices successfully.',
    });
}));
exports.default = router;
