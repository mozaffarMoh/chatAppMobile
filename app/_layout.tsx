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
import SingleChat from "./(screens)/SingleChat";
import { Provider } from "react-redux";
import store from "@/store";
import { AuthProvider } from "@/Context/AuthProvider";
import { MessagesCacheProvider } from "@/Context/MessagesProvider";
import { UsersProvider } from "@/Context/UsersProvider";

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
    <Provider store={store}>
      <AuthProvider>
        <SQLiteProvider databaseName="chatApp.db">
          <MessagesCacheProvider>
            <StatusBar style="dark" />
            <Main />
          </MessagesCacheProvider>
        </SQLiteProvider>
      </AuthProvider>
    </Provider>
  );
}

export default RootLayout;
