import { Request, Response } from 'express';
import postService from './postService';
import logger from '../../services/logger.service'
import SessionData from '../../../../types/sessionType'



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

// async function editPost(req: Request, res: Response): Promise<void> {
//   try {

//   } catch (error) {
//     // logger.error('Failed to signup', error);
//     // res.status(500).json({ error: 'Failed to signup' });
//   }
// }


const postController = {
  createPost,
//   editPost
};

export default postController; 