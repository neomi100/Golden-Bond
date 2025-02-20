import { Request, Response } from 'express';
import authService from './authService';
import logger from '../../services/logger.service'
import SessionData from '../../../../types/sessionType'


async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    //   const { error } = schema.validate({ username, password });
    //   if (error) {
    //     logger.error(`Validation error: ${error.details[0].message}`);
    //     res.status(400).json({ message: error.details[0].message });
    //     return;
    //   }
    const user = await authService.login(username, password);
    if (req.session) {
      req.session.user = user;
    }
    res.json({ message: 'Login successfully!', user });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login error' });
  }
};

async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    // const { error } = schema.validate({ username, password });
    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }
    const user = await authService.signup(username, password);
    req.session.user = user;
    res.json({ message: 'Signup successfully!', user });
  } catch (error) {
    logger.error('Failed to signup', error);
    res.status(500).json({ error: 'Failed to signup' });
  }
}


async function logout(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session.user || !req.session.user._id) {
      throw new Error('You are not logged in');
    }
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Failed to logout' });
      res.send('Logged out successfully');
    });
  } catch (error) {
    logger.error('Failed to logout', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
}

const authController = {
  login,
  signup,
  logout
};

export default authController; 