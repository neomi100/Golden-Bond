import { User } from "./userType";

export interface AuthUser {
  user: User | null;
  login: (fullname: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export { }; 