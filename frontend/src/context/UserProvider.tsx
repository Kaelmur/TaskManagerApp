import { useEffect, useState, FC, ReactNode } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { User, UserContext } from "./userContext";

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      clearUser();
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Save token
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
