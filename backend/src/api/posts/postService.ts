// import { title } from 'process';
import { Post } from '../../../../types/postType'
import logger from '../../services/logger.service';
import PostModel from './postModel'
import { Types } from 'mongoose';

const formattedDate: string = new Date().toISOString();

const addPost = async (userId: string, post: Omit<Post, '_id'>): Promise<Post> => {
    try {
        const { title, content} = post
        // const updatedHistory: string[] = Array.isArray(updateHistory) ? [...updateHistory] : [];
        // updatedHistory.push(new Date().toISOString());
        // const updatedHistory = [...updateHistory, formattedDate];

        // const updatedHistory = [...(updateHistory || []), new Date().toISOString()];
        const newPost = new PostModel({
            userId: new Types.ObjectId(userId),
            title,
            content
        });
        const savedPost = await newPost.save();
        const addedPost = savedPost.toObject();
        return addedPost;

    } catch (error) {
        logger.error(`Failed to create post ${post}`, error);
        throw error;
    }
};

// async function signup(username: string, password: string): Promise<User> {
// try {
//     if (!username || !password) throw new Error('Username and password are required!');
//     const user = await userService.getByUsername(username);
//     if (user) throw new Error('Username is already taken.');
//     const saltRounds = 10;
//     const hash = await bcrypt.hash(password, saltRounds);
//     const addUser = await userService.addUser({ username, password: hash });
//     return addUser;
// } catch (error) {
//     logger.error(`Failed to signup ${username}`, error);
//     throw error;
// }
// }


const authService = {
    addPost,
    // signup
};

export default authService; 