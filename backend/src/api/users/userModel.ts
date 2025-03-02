import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  myFriends: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: []}
}, { timestamps: true, collection: 'users' });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
