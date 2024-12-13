import React from "react"; // Add this import
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "@/i18n";
import { SQLiteProvider } from "expo-sqlite";
import Drawer from "expo-router/drawer";
import DrawerContent from "@/components/DraweContent";
import LanguageToggle from "@/components/LanguageToggle";
import { primaryColor } from "@/constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [loaded] = useFonts({
    Bahij: require("../assets/fonts/Bahij.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setIsAuth(true);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="data.db">
      <StatusBar style="dark" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            headerShown: true,

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
    </SQLiteProvider>
  );
}

export default RootLayout;
