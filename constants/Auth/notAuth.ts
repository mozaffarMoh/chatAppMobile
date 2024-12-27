import { useAuth } from "@/components/AuthProviders";
import { setIsReset } from "@/Slices/isReset";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useDispatch } from "react-redux";


const notAuth = () => {
    const { isAuth, setIsAuth }: any = useAuth();
    const dispatch = useDispatch()

    const notAuthenticated = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("myData");
        dispatch(setIsReset(true));
        setIsAuth(false)
        router.push('/(screens)/Login')
    }
    return notAuthenticated
}

export default notAuth;