import SignInDialog from "@/components/custom/SignInDialog";
import { db } from "@/Service/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const LogInContext = createContext(null);

function loadStoredUser() {
  try {
    const saved = localStorage.getItem("User");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function createUser(name, email) {
  const firstName = name.split(" ")[0];
  return {
    name,
    email,
    given_name: firstName,
    nickname: name,
    picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
  };
}

export const LogInContextProvider = (props) => {
  const storedUser = loadStoredUser();
  const [user, setUser] = useState(storedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedUser);
  const [authReady, setAuthReady] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    setAuthReady(true);
  }, []);

  const saveUserToFirestore = async (userData) => {
    try {
      await setDoc(doc(db, "Users", userData.email), {
        userName: userData.name,
        userEmail: userData.email,
        userPicture: userData.picture,
        userNickname: userData.nickname,
      });
    } catch (error) {
      console.error("Failed to save user to Firestore:", error);
    }
  };

  const signIn = useCallback(async (name, email) => {
    const trimmedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail) {
      toast.error("Please enter your name and email.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    setIsLoading(true);
    try {
      const userData = createUser(trimmedName, normalizedEmail);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("User", JSON.stringify(userData));
      await saveUserToFirestore(userData);
      setIsSignInOpen(false);
      toast.success(`Welcome, ${userData.given_name}!`);
      return true;
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.error("Sign in failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openSignIn = useCallback(() => {
    setIsSignInOpen(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setTrip([]);
    localStorage.removeItem("User");
    localStorage.removeItem("Trip");
    toast.success("Signed out");
  }, []);

  return (
    <LogInContext.Provider
      value={{
        user,
        signIn,
        openSignIn,
        logout,
        isAuthenticated,
        authReady,
        trip,
        setTrip,
        authLoading: isLoading,
      }}
    >
      {props.children}
      <SignInDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSignIn={signIn}
        isLoading={isLoading}
      />
    </LogInContext.Provider>
  );
};
