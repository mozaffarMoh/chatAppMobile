import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import baseApi from "../api/baseApi";
import notAuth from "@/constants/Auth/notAuth";

const usePut = (endPoint: string, body: any): any => {
    const router = useRouter();
    const notAuthenticated = notAuth();

    const [loading, setLoading] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const putData = async () => {
        setErrorMessage("");
        setLoading(true);
        setSuccess(false);

        try {
            await baseApi.put(endPoint, body);
            setLoading(false);
            setSuccess(true);
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
                errorMessage && setErrorMessage("");
            }, 4000);
        }
    };

    return [putData, loading, success, errorMessage];
};

export default usePut;
