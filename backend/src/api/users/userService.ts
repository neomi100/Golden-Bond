// import User from "./userModel";
import { ObjectId } from 'mongodb';
import dbService from '../../services/db.service';
import logger from '../../services/logger.service';
import { User } from '../../../../types/userType';
import UserModel from './userModel'


// export const getById = async (userId: string): Promise<Omit<User, 'password'> | null> => {
//   try {
//     const collection = await dbService.getCollection('users');
//     const user = await collection.findOne<User>({ _id: new ObjectId(userId) });

//     if (!user) return null;

//     // Remove password before returning
//     const { password: _, ...userWithoutPassword } = user;

//     return userWithoutPassword;
//   } catch (error) {
//     logger.error(`User not found ${userId}`, error);
//     throw error;
//   }
// };

// const collection = await dbService.getCollection(users);


export const getByUsername = async (username: string): Promise<User | null> => {
  try {
    const user = await UserModel.findOne<User>({ username }).lean();
  //  // For the login the user back with the password
    return user;
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


// const createUser = async (name: string, email: string, password: string) => {
//     try {
//         const user = new User({
//           name: "Neomi Goldberg",
//           email: "neomi@example.com",
//           password: "hashedpassword123",
//         });
//         await user.save();
//         console.log("✅ User added to database!");
//       } catch (error) {
//         console.error("❌ Error creating user:", error);
//       }
// //   return await User.create({ name, email, password });
// };



const userService = {
  getByUsername,
  addUser
};

export default userService; 