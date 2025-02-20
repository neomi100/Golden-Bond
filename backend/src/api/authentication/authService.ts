import bcrypt from 'bcrypt';
import { User } from '../../../../types/userType'
import userService from '../users/userService';
import logger from '../../services/logger.service';



const login = async (username: string, password: string): Promise<Omit<User, 'password'>> => {
  try {
    const user = await userService.getByUsername(username);
    if (!user) throw new Error('The username is not registered');
    const match = await bcrypt.compare(password, user.password as string);
    if (!match) throw new Error('Invalid password');
    delete user.password
    return user;
  } catch (error) {
    logger.error(`Failed to login ${username}`, error);
    throw error;
  }
};

async function signup(username: string, password: string): Promise<User> {
  try {
    if (!username || !password) throw new Error('Username and password are required!');
    const user = await userService.getByUsername(username);
    if (user) throw new Error('Username is already taken.');
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const addUser = await userService.addUser({ username, password: hash });
    return addUser;
  } catch (error) {
    logger.error(`Failed to signup ${username}`, error);
    throw error;
  }
}


const authService = {
  login,
  signup
};

export default authService; 