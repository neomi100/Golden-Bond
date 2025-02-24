import mongoose from "mongoose";
import { Post } from '../../../../types/postType'

const formattedDate: string = new Date().toISOString();

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: false },
  title: { type: String, required: true },
  content: {
    text: { type: String, required: false, default: null },
    photo: { type: String, required: false, default: null }
  },
  updateHistory: { type: [String], default: [formattedDate], required: true },
}, { timestamps: true });


const PostModel = mongoose.model<Post>("Post", postSchema);
export default PostModel;