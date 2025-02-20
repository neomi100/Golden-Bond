import 'express-session';
import { User } from "./userType";

declare module 'express-session' {
  interface SessionData {
    user?: User;
  }
}

export { }; 