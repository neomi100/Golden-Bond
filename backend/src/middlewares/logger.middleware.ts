import { Request, Response, NextFunction } from 'express';
import logger from '../services/logger.service';

async function log(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.session && req.session.user) {
        logger.info(`Req from: ${req.session.user.username}`);
    }
    next();
}

export {
    log
};
