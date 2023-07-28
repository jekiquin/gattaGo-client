import { createContext, useState } from "react";

export interface AuthContextTypes {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  currentTeamName: string;
  setCurrentTeamName: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextTypes | null>(null);

export const AuthProvider = ({ children }: AuthContextProps): JSX.Element => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [currentTeamName, setCurrentTeamName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        userId,
        setUserId,
        email,
        setEmail,
        isLoggedIn,
        setIsLoggedIn,
        currentTeamName,
        setCurrentTeamName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
