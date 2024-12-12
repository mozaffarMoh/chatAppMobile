import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "@/i18n";
import { SQLiteProvider } from "expo-sqlite";
import Register from "./screens/Register";
import Login from "./screens/Login";
import { Slot, Stack } from "expo-router";
import FriendsList from "@/components/FriendsList";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Bahij: require("../assets/fonts/Bahij.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="test.db">
      <StatusBar style="auto" />
     {/*  <Slot /> */}
      <FriendsList />
    </SQLiteProvider>
  );
}
