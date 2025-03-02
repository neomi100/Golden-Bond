import logger from '../../services/logger.service';
import { User } from '../../../../types/userType';
import UserModel from './userModel'
import { Types } from 'mongoose';

async function query(): Promise<User[]> {
  try {
    return await UserModel.find().exec();
  } catch (error) {
    logger.error('No users found', error);
    throw error;
  }
}

async function addFriend(userId: Types.ObjectId, friendId: Types.ObjectId): Promise<User> {
  try {
    const objectId = new Types.ObjectId(userId);
    const updatedUser = await UserModel.findByIdAndUpdate(
      objectId,
      { $push: { myFriends: friendId } },
      { new: true }
    ).select('-password');
    if (!updatedUser) throw new Error(`User with ID ${userId} not found`);
    return updatedUser.toObject();
  } catch (error) {
    logger.error(`Failed to add friend ${friendId}`, error);
    throw error;
  }
}

async function getYourFriends(userId: Types.ObjectId) {
  try {
    const user = await UserModel.findById(userId).select('-password').exec();
    if (!user || !user.myFriends || user.myFriends.length === 0) {
      throw new Error("User not found or has no friends");
    }
    return await UserModel.find({ _id: { $in: user.myFriends } }).lean();
  } catch (error) {
    logger.error(`Failed to get friends:`, error);
    throw error;
  }
};

async function getById(userId: Types.ObjectId): Promise<User | null> {
  try {
    const user = await UserModel.findById(userId).select('-password').exec();
    return user ? user : null;
  } catch (error) {
    logger.error(`User not found ${userId}`, error);
    throw error;
  }
};


async function getByUsername(username: string): Promise<User | null> {
  try {
    //  // For the login the user back with the password
    return await UserModel.findOne<User>({ username }).lean();
  } catch (error) {
    logger.error(`User not found ${username}`, error);
    throw error;
  }
};


async function addUser(user: User): Promise<User> {
  try {
    const userToAdd = new UserModel({
      username: user.username,
      password: user.password
    });
    await userToAdd.save();
    const userWithoutPassword = userToAdd.toObject();
    delete userWithoutPassword.password;
    return userWithoutPassword;
  } catch (error) {
    logger.error(`Failed to insert user ${user.username}`, error);
    throw error;
  }
}


const userService = {
  getByUsername,
  addUser,
  query,
  addFriend,
  getById,
  getYourFriends
};

export default userService; 