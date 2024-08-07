"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

import { IUser } from "../utils/types";
import { jwtTokenDecode } from "../utils/utils";
import axios from "axios";

interface IUserContext {
  loginUser: (userData: IUser) => void;
  logoutUser: () => void;
  user: IUser | null;
  initializeUser: boolean;
  setInitializedUser: Dispatch<SetStateAction<boolean>>;
  isUserAuthenticated: boolean;
}

export const UserContext = createContext<IUserContext>({
  loginUser: () => {},
  logoutUser: () => {},
  user: null,
  initializeUser: false,
  setInitializedUser: () => false,
  isUserAuthenticated: false,
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);

  const [initializeUser, setInitializedUser] = useState(false);

  const [isUserAuthenticated, setIsUserIsAuthenticated] = useState(false);

  const loginUser = (userData: IUser) => {
    setUser(userData);
    setInitializedUser(true);
    setIsUserIsAuthenticated(true);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    setInitializedUser(true);
    setIsUserIsAuthenticated(false);
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtTokenDecode(token);

        try {
          const userData = await axios.get(`/api/user/getUser`, {
            params: {
              uid: decodedToken.uid,
            },
          });

          loginUser(userData.data.user);
        } catch (error) {
          console.error("Error initializing user:", error);
          logoutUser();
        } finally {
          setInitializedUser(true);
        }
      } else {
        setInitializedUser(true);
      }
    };
    initializeUser();
  }, []);

  const contextValue: IUserContext = {
    user,
    loginUser,
    logoutUser,
    initializeUser,
    setInitializedUser,
    isUserAuthenticated,
  };

  return (
    <UserContext.Provider value={contextValue as IUserContext}>
      {children}
    </UserContext.Provider>
  );
};
