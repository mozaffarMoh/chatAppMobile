import React from "react"; // Add this import
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "@/i18n";
import { SQLiteProvider } from "expo-sqlite";
import Main from "./main";
import { Provider } from "react-redux";
import store from "@/store";
import { AuthProvider } from "@/Context/AuthProvider";
import { MessagesCacheProvider } from "@/Context/MessagesProvider";

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
            <Main />
          </MessagesCacheProvider>
        </SQLiteProvider>
      </AuthProvider>
    </Provider>
  );
}

export default RootLayout;
