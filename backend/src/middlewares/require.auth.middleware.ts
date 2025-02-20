import { Request, Response, NextFunction } from 'express';
import logger from '../services/logger.service';

function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (!req.session || !req.session.user) {
        logger.error('There is no user logged in');
        res.status(401).end('Unauthorized!');
        return;
    }
    next();
}

export {
    requireAuth
};
