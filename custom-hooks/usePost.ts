import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import baseApi from "../api/baseApi";
import notAuth from "@/constants/Auth/notAuth";

const usePost = <T,>(endPoint: string, body: object): any => {
  const notAuthenticated = notAuth();
  const router = useRouter();

  const [data, setData] = React.useState<T>({} as T);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string>("");

  const handlePost = async () => {
    setLoading(true);
    setSuccess(false);


    try {
      const res: any = await baseApi.post(endPoint, body);
      setSuccessMessage(res?.data?.message);
      setLoading(false);
      setData(res.data);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 2000);

      // Check if current segment matches "login" or "sign-up"
      if (endPoint.includes("login") || endPoint.includes("register")) {
        setTimeout(async () => {
          setSuccess(false);
          await AsyncStorage.setItem("token", res.data.token);
          await AsyncStorage.setItem("userId", res.data.userId);
          router.replace("/"); // Navigate to home page
        }, 3000);
      }

    } catch (err: any) {
      setLoading(false);

      const message = err.response?.data?.message;
      if (!err.response) {
        setErrorMessage("Network error: Please check your internet connection.");
      } else if (
        message === "Token is blacklisted" ||
        message === "Token has expired" ||
        message === "Invalid token"
      ) {
        notAuthenticated();
      } else if (err?.message && err?.message === "Network Error") {
        setErrorMessage("Server cannot respond, check internet connection");
      } else if (err?.response?.status === 500) {
        setErrorMessage("Server cannot respond, check internet connection");
      } else if (err?.response?.data) {
        setErrorMessage(err.response.data);
      }

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

    }
  };

  return [handlePost, loading, success, errorMessage, data, successMessage, setData];
};

export default usePost;
