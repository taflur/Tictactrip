import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const secretKey = process.env.SECRET_KEY || '';
export function generateToken(email) {
    // email validation pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return { error: 'Invalid email format' };
    }
    return jwt.sign({ email }, secretKey, { expiresIn: '1d' });
}
export function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'No Authorization header found in the request' });
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token has expired' });
            }
            else {
                return res.status(403).json({ error: 'Invalid token' });
            }
        }
        req.body.email = user.email;
        next();
    });
}
//# sourceMappingURL=auth.js.map