const jwt = require ('jsonwebtoken');
const SECRECT_KEY = 'SECRECT_KEY';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from headers

    if (!token) {
        return res.status(403).json({ error: "Access Denied. No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRECT_KEY); // Verify token
        req.user = decoded; // Attach user ID to request object
        next(); // Move to next middleware/controller
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
};

module.exports = authMiddleware;
