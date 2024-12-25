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
import Main from "./main";
import { Slot, Stack } from "expo-router";
import { AuthProvider } from "@/components/AuthProviders";
import SingleChat from "./(screens)/SingleChat";


SplashScreen.preventAutoHideAsync();

function RootLayout() {
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
    <AuthProvider>
      <SQLiteProvider databaseName="chatApp.db">
        <StatusBar style="dark" />
        <Main />
      </SQLiteProvider>
    </AuthProvider>
  );
}

export default RootLayout;
