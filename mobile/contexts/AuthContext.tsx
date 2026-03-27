import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

import { login as apiLogin, register as apiRegister, type AuthUser, type RegisterAttributes } from "../requests/auth";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const USER_STORAGE_KEY = "auth_user";

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (attributes: RegisterAttributes) => Promise<void>;
  logout: () => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
  loginError: string | null;
  registerError: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    SecureStore.getItemAsync(USER_STORAGE_KEY).then((stored) => {
      if (stored) setUser(JSON.parse(stored));
    });
  }, []);

  const persistUser = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(u));
    } else {
      SecureStore.deleteItemAsync(USER_STORAGE_KEY);
    }
  };

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) => apiLogin(username, password),
    onSuccess: (data) => {
      persistUser(data);
      setLoginError(null);
    },
    onError: (err: Error) => {
      setLoginError(err.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (attributes: RegisterAttributes) => apiRegister(attributes),
    onSuccess: (data) => {
      persistUser(data);
      setRegisterError(null);
    },
    onError: (err: Error) => {
      setRegisterError(err.message);
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const register = async (attributes: RegisterAttributes) => {
    await registerMutation.mutateAsync(attributes);
  };

  const logout = () => {
    persistUser(null);
    setLoginError(null);
    setRegisterError(null);
    loginMutation.reset();
    registerMutation.reset();
    router.replace("/(tabs)");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        login,
        register,
        logout,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        loginError,
        registerError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
