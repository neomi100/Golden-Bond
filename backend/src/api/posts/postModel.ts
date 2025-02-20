import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
