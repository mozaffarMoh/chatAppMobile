import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseApi = axios.create({
    baseURL: "https://chatappapi-2w5v.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

//http://localhost:8080
//https://chatappapi-2w5v.onrender.com

baseApi.interceptors.request.use(
    async (config: any) => {
        try {
            const token = await AsyncStorage.getItem("token"); // Retrieve token from AsyncStorage
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error retrieving token from AsyncStorage:", error);
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export default baseApi;
