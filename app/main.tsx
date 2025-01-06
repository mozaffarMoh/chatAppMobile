import { useAuth } from "@/Context/AuthProvider";
import { useSocket } from "@/Context/SocketRefProvider";
import DrawerContent from "@/components/DraweContent";
import ThemeToggle from "@/components/ThemeToggle";
import { primaryColor } from "@/constants/colors";
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import useCustomTheme from "@/custom-hooks/useCustomTheme";
import useSocketMonitor from "@/custom-hooks/useSocketMonitor";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import Drawer from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  scheduleAndCancel,
  sendPushNotification,
} from "@/constants/notifications";
import { useTranslation } from "react-i18next";
import { playReceiveMessageSound } from "@/constants/soundsFiles";
import { useDispatch } from "react-redux";
import { setIsUsersRefresh } from "@/Slices/refreshUsers";

const Main = () => {
  const { t } = useTranslation();
  const { defaultTitle, defaultBG, isDark } = useCustomTheme();
  const { isAuth }: any = useAuth();

  const dispatch = useDispatch();
  const { socketRef, isMessageReceived, setIsMessageReceived } =
    useSocketMonitor();
  let message = {
    sound: "default",
    title: t("messages.receiveMessageTitle"),
    body: t("messages.receiveMessageSubTitle"),
    badge: 3,
    data: { someData: "goes here" },
  };

  useEffect(() => {
    if (isMessageReceived) {
      console.log("receveid success from main");
      playReceiveMessageSound();
      //scheduleAndCancel(message);      //local notification
      setIsMessageReceived(false);
      dispatch(setIsUsersRefresh(true));
    }
  }, [isMessageReceived]);

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
