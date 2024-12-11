import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DrawerToggleButton } from "@react-navigation/drawer";
import LanguageToggle from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  let tintColor = Colors[colorScheme ?? "dark"].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: true,
        headerLeft: () => (
          <DrawerToggleButton tintColor={tintColor} />
        ),
        headerRight: () => <LanguageToggle />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("main"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: t("about"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "information" : "information-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: t("services"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "shapes" : "shapes-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auth/login"
        options={{
          title: t("login"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "log-in" : "log-in-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
