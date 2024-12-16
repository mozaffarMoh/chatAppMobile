import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import baseApi from "../api/baseApi";
import notAuth from "@/constants/Auth/notAuth";

const useDelete = (endPoint: string): any => {
  const router:any = useRouter();
  const notAuthenticated = notAuth();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await baseApi.delete(endPoint);
      setLoading(false);
      setSuccessMessage("Your account has been deleted successfully.");

      setTimeout(async () => {
        if (endPoint.includes("users")) {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("userId");
          router.replace("/(screens)/Login"); // Navigate to login page
        }
        setSuccessMessage("");
      }, 3000);
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
        setErrorMessage(err.response.data.error);
      }

      setTimeout(() => {
        errorMessage && setErrorMessage("");
      }, 4000);
    }
  };

  return [handleDelete, loading, errorMessage, successMessage];
};

export default useDelete;
