"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.generateToken = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
var secretKey = process.env.SECRET_KEY || '';
function generateToken(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return { error: 'Invalid email format' };
    }
    return jsonwebtoken_1.default.sign({ email: email }, secretKey, { expiresIn: '1d' });
}
exports.generateToken = generateToken;
function authenticateToken(req, res, next) {
    var token = req.headers.authorization;
    if (!token) {
        res.status(401);
        res.json({ error: 'No Authorization header found in the request' });
        return res;
    }
    jsonwebtoken_1.default.verify(token, secretKey, function (err, user) {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(401);
                res.json({ error: 'Token has expired' });
                return res;
            }
            else {
                res.status(403);
                res.json({ error: 'Invalid token' });
                return res;
            }
        }
        req.body.email = user.email;
        next();
    });
}
exports.authenticateToken = authenticateToken;
