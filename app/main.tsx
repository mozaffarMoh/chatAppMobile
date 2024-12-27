import { useAuth } from "@/components/AuthProviders";
import DrawerContent from "@/components/DraweContent";
import LanguageToggle from "@/components/LanguageToggle";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Redirect } from "expo-router";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Main = () => {
  const { isAuth }: any = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: isAuth ? true : false,
          headerTitleStyle: {
            fontWeight: 800,
            color: "#333",
          },
          headerStyle: {
            backgroundColor: "#0cc",
          },
          drawerStyle: {
            backgroundColor: primaryColor + "cc",
          },
          headerRight: () => <LanguageToggle />,
          swipeEnabled: isAuth ? true : false, 
        }}
        drawerContent={() => <DrawerContent />}
      />
    </GestureHandlerRootView>
  );
};

export default Main;
