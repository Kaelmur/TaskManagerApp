import { createContext } from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImageUrl: string;
  role: "admin" | "member";
  token: string;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (userData: User) => void;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  updateUser: () => {},
  clearUser: () => {},
});
