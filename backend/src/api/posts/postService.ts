import { Post } from '../../../../types/postType'
import logger from '../../services/logger.service';
import PostModel from './postModel'
import { Types } from 'mongoose';

const formattedDate: string = new Date().toISOString();

const addPost = async (userId: string, post: Omit<Post, '_id'>): Promise<Post> => {
    try {
        const { title, content} = post
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

async function editPost(updatePost: Post, postId: string): Promise<Post> {
    try {
      const postToUpdate = { ...updatePost };
      postToUpdate.updateHistory.push(formattedDate);
      const objectId = new Types.ObjectId(postId); 
      const updatedPost = await PostModel.findByIdAndUpdate(
        objectId,
        { $set: postToUpdate },
        { new: true } 
      );
      return updatedPost;
    } catch (error) {
      logger.error(`Failed to update post ${postId}`, error);
      throw error;
    }
  }


const authService = {
    addPost,
    editPost
};

export default authService; 