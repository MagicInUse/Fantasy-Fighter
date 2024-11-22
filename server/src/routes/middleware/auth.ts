import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index';
import { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// JWT Validation Middleware
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        res.status(401).json({ error: 'Access denied. Invalid token format.' });
        return;
    }

    const token = tokenParts[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach the decoded user to req.user
        next();
    } catch (error) {
        res.status(401).json({ error: 'Access denied. Invalid or expired token.' });
    }
};

// Check Level Access Middleware
export const authenticateLevelAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Access denied. User information missing.' });
        }

        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const requestedLevel = parseInt(req.params.levelId, 10);

        if (isNaN(requestedLevel)) {
            return res.status(400).json({ error: 'Invalid level ID provided.' });
        }

        if (user.level < requestedLevel) {
            return res.status(403).json({ error: `Level ${requestedLevel} is locked. Complete level ${user.level} to progress.` });
        }

        next();
    } catch (error) {
        console.error("Error in authenticateLevelAccess middleware", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};