import { useAuth } from "@/components/AuthProviders";
import DrawerContent from "@/components/DraweContent";
import LanguageToggle from "@/components/LanguageToggle";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Redirect, useNavigation } from "expo-router";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Main = () => {
  const { isAuth }: any = useAuth();
  const navigation = useNavigation(); // Hook to access the navigation object

  const handleMenuPress = () => {
    DrawerToggleButton;
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: isAuth ? true : false,
          headerTitleStyle: {
            fontWeight: 800,
            color: "#eee",
          },

          headerStyle: {
            backgroundColor: "#7722aa",
          },
          drawerStyle: {
            backgroundColor: primaryColor + "cc",
          },

          headerLeft: () => <DrawerToggleButton tintColor="#eee" />,
          headerRight: () => <LanguageToggle />,
          swipeEnabled: isAuth ? true : false,
        }}
        drawerContent={() => <DrawerContent />}
      />
    </GestureHandlerRootView>
  );
};

export default Main;
