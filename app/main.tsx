import { useAuth } from "@/components/AuthProviders";
import DrawerContent from "@/components/DraweContent";
import LanguageToggle from "@/components/LanguageToggle";
import { primaryColor } from "@/constants/colors";
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
          headerStyle: {
            backgroundColor: primaryColor, // Set the background color to green
          },
          drawerStyle: {
            backgroundColor: primaryColor + "cc",
          },
          headerRight: () => <LanguageToggle />,
        }}
        drawerContent={() => <DrawerContent />}
      />
    </GestureHandlerRootView>
  );
};

export default Main;
