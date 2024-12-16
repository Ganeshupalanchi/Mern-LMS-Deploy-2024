import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { toast, useToast } from "@/hooks/use-toast";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const { toast } = useToast();
  const handleRegisterUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      if (data.success) {
        setLoading(false);
        setSignUpFormData(initialSignUpFormData);
        toast({
          title: "User registered.",
        });
      }
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.message) {
        toast({
          title: error.response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginService(signInFormData);
      if (response.success) {
        toast({
          title: "Login successfully.",
        });
        setLoading(false);
        setAuth({
          authenticate: true,
          user: response.data.user,
        });

        sessionStorage.setItem(
          "token",
          JSON.stringify(response.data.accessToken)
        );
      }
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.message) {
        toast({
          title: error.response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong.",
          variant: "destructive",
        });
      }
    }
  };

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const response = await checkAuthService();
      if (response.success) {
        setAuthLoading(false);
        setAuth({
          authenticate: true,
          user: response.data.user,
        });
      }
    } catch (error) {
      setAuthLoading(false);
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  };

  const logoutUser = () => {
    setAuth({
      authenticate: false,
      user: null,
    });
    sessionStorage.clear();
  };
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        initialSignInFormData,
        initialSignUpFormData,
        handleRegisterUser,
        handleLogin,
        loading,
        auth,
        setAuth,
        logoutUser,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
