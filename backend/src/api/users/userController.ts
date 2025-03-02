import { User } from "../../../../types/userType";
import userService from "./userService";
import { Request, Response } from 'express';
import logger from '../../services/logger.service'
import { Types } from 'mongoose';

// interface GetToysRequest extends Request {
//     query: {
//         filterBy?: string;  // Express treats query params as strings
//     };
// }
async function query(req: Request, res: Response): Promise<void> {
    try {
        // const filterBy = req.query.filterBy ? JSON.parse(req.query.filterBy as string).filterBy : {};
        const users: User[] = await userService.query();
        res.send(users);
    } catch (error) {
        logger.error('No users found', error);
        res.status(500).send({ error: 'Failed to get users' });
    }
}


async function addFriend(req: Request, res: Response): Promise<void> {
    try {
        const loggedinUserId: Types.ObjectId = req.session.user?._id;
        if (!loggedinUserId) throw new Error('You cannot add a friend without being logged in.');
        const friendId: Types.ObjectId = req.body.friendId;
        if (!friendId) throw new Error('Membership application ID not found');
        const updatedUserFriend = await userService.addFriend(loggedinUserId, friendId);
        res.json({ message: `Membership application for ${friendId} succeeded`, updatedUserFriend });
    } catch (error) {
        logger.error('Failed to update Post', error);
        res.status(500).send({ error: 'Failed to update Post' });
    }
}


async function getYourFriends(req: Request, res: Response): Promise<void> {
    try {
        const loggedinUserId: Types.ObjectId = req.session.user?._id;
        if (!loggedinUserId) throw new Error('You must be logged in to see your friends.');
        const yourFriends = await userService.getYourFriends(loggedinUserId);
        res.json({ message: `The friends of ${loggedinUserId} succeeded`, yourFriends });
    } catch (error) {
        logger.error(`Failed to find ${req.session.user?._id}'s friends`, error);
        res.status(500).send({ error: `Failed to find ${req.session.user?._id}'s friends` });
    }
}

const userController = {
    query,
    addFriend,
    getYourFriends
};

export default userController; 