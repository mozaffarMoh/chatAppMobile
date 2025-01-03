import { useAuth } from "@/Context/AuthProvider";
import DrawerContent from "@/components/DraweContent";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import useCustomTheme from "@/custom-hooks/useCustomTheme";
import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Redirect, useNavigation } from "expo-router";
import Drawer from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Main = () => {
  const { defaultTitle, defaultBG, isDark } = useCustomTheme();
  const { isAuth }: any = useAuth();

  const TogglesComponent = () => {
    return (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <ThemeToggle />
        <LanguageToggle />
      </View>
    );
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Drawer
        screenOptions={{
          headerShown: isAuth ? true : false,
          headerTitleStyle: {
            fontWeight: 800,
            color: defaultTitle,
          },

          headerStyle: {
            backgroundColor: defaultBG,
          },
          drawerStyle: {
            backgroundColor: primaryColor + "cc",
          },

          headerLeft: () => <DrawerToggleButton tintColor={defaultTitle} />,
          headerRight: () => <ThemeToggle />,
          swipeEnabled: isAuth ? true : false,
        }}
        drawerContent={() => <DrawerContent />}
      />
    </GestureHandlerRootView>
  );
};

export default Main;
