/* import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMessagesCache } from "../Context/MessagesContext";
import { useUserDetails } from "../Context/UserDetailsProvider";
import { useUsersContext } from "../Context/UsersProvider";
import { useDispatch } from "react-redux";
import { setReceiverId } from "../Slices/receiverIdSlice";

const notAuth = () => {
    const navigation = useNavigation();
    const { messagesCache, setMessagesCache }: any = useMessagesCache();
    const { users, setUsers }: any = useUsersContext();
    const { userDetails, setUserDetails }: any = useUserDetails();
    const dispatch = useDispatch();

    const notAuthenticated = async () => {
        dispatch(setReceiverId(""));
        messagesCache && setMessagesCache({});
        userDetails && setUserDetails({});
        users && setUsers({ users: [], page: 1 });

        // Remove tokens and user data from AsyncStorage
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userId");
        } catch (error) {
            console.error("Failed to clear AsyncStorage:", error);
        }

        // Navigate to the appropriate screen
        const token = await AsyncStorage.getItem("token");
        navigation.navigate(!token ? "StartPage" : "Login");
    };

    return notAuthenticated;
};

export default notAuth; */

import { useAuth } from "@/components/AuthProviders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";


const notAuth = () => {
    const { isAuth, setIsAuth }: any = useAuth();
    const notAuthenticated = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("myData");
        setIsAuth(false)
        router.push('/(screens)/Login')
    }
    return notAuthenticated
}

export default notAuth;