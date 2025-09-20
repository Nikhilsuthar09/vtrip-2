import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Configs/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getUserData } from "../utils/common/getUserData";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const DEFAULT_USER_DETAILS = {
  name: "User",
  uid: null,
  email: null,
  imageUrl: null,
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userDetails, setUserDetails] = useState(DEFAULT_USER_DETAILS);
  const [isRegistering, setIsRegistering] = useState(false);

  const refreshUserData = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.log("Error refreshing user data:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateUserState = async (firebaseUser, isMounted) => {
    if (!isMounted) return;

    if (firebaseUser) {
      try {
        const details = await getUserData(firebaseUser);
        if (isMounted) {
          setUserDetails(details);
        }
      } catch (error) {
        console.error("Error getting user data:", error);
        if (isMounted) {
          setUserDetails(DEFAULT_USER_DETAILS);
        }
      }
    } else {
      setUserDetails(DEFAULT_USER_DETAILS);
    }
    if (!isRegistering) {
      setIsLoggedIn(!!firebaseUser);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      try {
        setUser(firebaseUser);
        await updateUserState(firebaseUser, isMounted);
      } catch (error) {
        console.error("Error in auth state change:", error);
        if (isMounted) {
          setIsLoggedIn(false);
        }
      } finally {
        if (isMounted && !isRegistering) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isRegistering, refreshTrigger]);
  const setRegistrationState = (state) => {
    setIsRegistering(state);
  };

  const contextValue = {
    isLoggedIn,
    isLoading,
    isRegistering,
    setRegistrationState,
    user,
    refreshUserData,
    ...userDetails,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
