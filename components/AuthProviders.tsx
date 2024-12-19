import baseApi from "@/api/baseApi";
import { endPoint } from "@/api/endPoint";
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext: any = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    getItemFromStorage("token", setToken);
  }, []);

  //console.log(' auth :',isAuth,'token : ',token);
  

  useEffect(() => {
    if (token) {
      baseApi
        .post(endPoint.checkToken, { token: token })
        .then(() => {
          setIsAuth(true);
        })
        .catch(() => {
          setIsAuth(false);
        });
    }
    if (token == null) {
      setIsAuth(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
