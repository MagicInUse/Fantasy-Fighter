import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Level, Character } from '../../models/index';
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
    } catch (error) {
        res.status(401).json({ error: 'Access denied. Invalid or expired token.' });
    }

    const character = await Character.findOne({ where: { userId: req.user.id } });
    if (!character) {
        res.status(404).json({ error: 'Character not found.' });
        return;
    }

    try {
        const levels = await Level.findAll(); // Fetch all levels
        const updatedLevels = levels.map(level => {
            if (level.level_id < character.level) {
                level.complete = true;
                level.locked = false;
            } else if (level.level_id === character.level) {
                level.complete = false;
                level.locked = false;
            } else {
                level.complete = false;
                level.locked = true;
            }
            try {
                console.log('Updating level:', level.level_id);
                level.save();
            } catch (error) {
                console.error('Error updating level:', error);
            }
        });
        res.status(200).json(updatedLevels);
    } catch (error) {
        console.error('Error fetching levels:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};