import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try { 
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user; 
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token or expired token" });
    }
};

export default authenticate;
