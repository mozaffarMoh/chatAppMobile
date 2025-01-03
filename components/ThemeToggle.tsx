import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import * as Updates from "expo-updates";
import { useDispatch, useSelector } from "react-redux";
import { RootType } from "@/store";
import { setActiveTheme } from "@/Slices/activeTheme";
import { Ionicons } from "@expo/vector-icons";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const activeTheme = useSelector((state: RootType) => state.activeTheme.value);
  const isDark = activeTheme == "dark";
  const changeTheme = async (newTheme: string) => {
    try {
      await AsyncStorage.setItem("activeTheme", newTheme);
      dispatch(setActiveTheme(newTheme));
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.switch, isDark ? styles.darkBG : styles.LightBG]}
        onPress={() => changeTheme(isDark ? "light" : "dark")}
      >
        <View
          style={[
            styles.toggleCircle,
            isDark ? styles.toggleCircleDark : styles.toggleCircleLight,
          ]}
        />
        {isDark ? (
          <Ionicons
            name="sunny"
            color={"#eee"}
            size={15}
            style={{ position: "absolute", left: 7 }}
          />
        ) : (
          <Ionicons
            name="moon"
            color={"#222"}
            size={15}
            style={{ position: "absolute", right: 7 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  switch: {
    marginTop: 15,
    marginRight: 10,
    width: 55,
    height: 25,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    position: "relative",
  },
  darkBG: {
    backgroundColor: "#333",
  },
  LightBG: {
    backgroundColor: "#ccc",
  },
  toggleCircle: {
    width: 20,
    height: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
    position: "absolute",
    top: 5,
  },
  toggleCircleDark: {
    right: 5,
  },
  toggleCircleLight: {
    left: 5,
  },
});

export default ThemeToggle;
