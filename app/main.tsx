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
import { useTranslation } from "react-i18next";
import { playReceiveMessageSound } from "@/constants/soundsFiles";
import { useDispatch } from "react-redux";
import { setIsUsersRefresh } from "@/Slices/refreshUsers";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async (notification: any) => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      badge: notification.data?.badge || 0,
    };
  },
});

const Main = () => {
  const dispatch = useDispatch();
  const { isAuth }: any = useAuth();
  const { defaultTitle, defaultBG, isDark } = useCustomTheme();
  const { isMessageReceived, setIsMessageReceived } = useSocketMonitor();

  useEffect(() => {
    if (isMessageReceived) {
      console.log("receveid success from main");
      setIsMessageReceived(false);
      dispatch(setIsUsersRefresh(true));
    }
  }, [isMessageReceived]);

  // Listen for notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    return () => subscription.remove();
  }, []);

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
