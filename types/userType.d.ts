export interface User {
  _id?: Types.ObjectId;
  username: string;
  email?: string | null;
  password?: string | null;
  role?: 'user' | 'admin';
  myFriends?: Types.ObjectId[]
}

export { }; 