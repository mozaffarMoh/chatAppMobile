import { useState } from "react";
import axios from "axios";

const useGet = (endPoint: string): any => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getData = () => {
        setSuccess(false);
        setLoading(true);
        axios
            .get(endPoint)
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setData(res.data);
            })
            .catch((err: any) => {
                setLoading(false);
                const message = err.response?.data?.message;
                if (!err.response) {
                    setErrorMessage("Network error: Please check your internet connection.");
                } else {
                    setErrorMessage(err.response?.data);
                }

            })

    };



    return [data, loading, getData, success, errorMessage, setData];
};

export default useGet;
