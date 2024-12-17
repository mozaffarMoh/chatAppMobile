import { useEffect, useState, useRef } from "react";
import axios from "axios";
import baseApi from "../api/baseApi";
import notAuth from "@/constants/Auth/notAuth";

const useGet = (endPoint: string): any => {
    const notAuthenticated = notAuth();
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const abortControllersRef = useRef<{ [key: string]: AbortController | null }>({});

    const getData = async () => {
        // Cancel any ongoing request for this endpoint
        if (abortControllersRef.current[endPoint]) {
            abortControllersRef.current[endPoint]!.abort();
        }

        // Create a new AbortController
        const abortController = new AbortController();
        abortControllersRef.current[endPoint] = abortController;

        setSuccess(false);
        setLoading(true);
        setErrorMessage("");

        await baseApi.get(endPoint).then((res: any) => {
            setData(res.data);
            setSuccess(true);

            if (endPoint.includes("logout")) {
                notAuthenticated();
            }

            setLoading(false);
        }).catch((err: any) => {
            if (axios.isCancel(err)) {
                console.log("Request canceled:", endPoint);
                return;
            } else if (err.name === "AbortError") {
                console.log("Request aborted:", endPoint);
                return;
            } else {
                setLoading(false);
                const message = err.response?.data?.message;
                if (!err.response) {
                    setErrorMessage("Network error: Please check your internet connection.");
                } else if (["Token is blacklisted", "Token has expired", "Invalid token"].includes(message)) {
                    notAuthenticated();
                } else {
                    setErrorMessage(message || "An error occurred.");
                }
            }

            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        })
    };

    useEffect(() => {
        // Prevent auto-fetching for specific endpoints
        if (!endPoint.includes("logout") && !endPoint.includes("messages") && !endPoint.includes("one-user")) {
            getData();
        }

        return () => {
            // Cancel any ongoing request when the component unmounts or endpoint changes
            if (abortControllersRef.current[endPoint]) {
                abortControllersRef.current[endPoint]!.abort();
            }
        };
    }, [endPoint]);

    return [data, loading, getData, success, errorMessage, setData];
};

export default useGet;
