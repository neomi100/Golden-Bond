import { Request, Response } from 'express';
import postService from './postService';
import logger from '../../services/logger.service'
import SessionData from '../../../../types/sessionType'
import {Post} from '../../../../types/postType'


async function createPost(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.session?.user?._id;
        if (!userId) throw new Error("You must login to post");
        const createPost = await postService.addPost(userId, req.body);
         res.json({ message: `Your post has been published`, createPost });
      } catch (error) {
        logger.error("Failed to add post", error);
        res.status(500).send({ error: "Failed to add post" });
      }
};

async function editPost(req: Request, res: Response): Promise<void> {
  try {
    const loggedinUserId: string = req.session.user?._id;
    const post: Post = req.body; 
    // const post: Partial<Post> = req.body; // Ensuring that Post has partial Post fields
    if (!post) throw new Error('Details must be filled in for updating the post');
    const { userId } = post;
    if (!userId) throw new Error('You must login to access your Post');
    if (userId !== loggedinUserId) throw new Error('You can\'t edit a post that isn\'t yours.');
    const { postId } = req.params;
    const updatedPost = await postService.editPost(post, postId);
    res.json({ message: `Your Post number ${updatedPost._id} was updated`, updatedPost });
} catch (error) {
    logger.error('Failed to update Post', error);
    res.status(500).send({ error: 'Failed to update Post' });
}
}


const postController = {
  createPost,
  editPost
};

export default postController; 