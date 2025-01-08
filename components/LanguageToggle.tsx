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

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";

  const changeLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem("language", lang);
      i18n.changeLanguage(lang);
      await Updates.reloadAsync();
      
      /*       I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);

      if (I18nManager.isRTL) {
        await Updates.reloadAsync();
      } */
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.switch, isRTL ? styles.switchRTL : styles.switchLTR]}
        onPress={() => changeLanguage(isRTL ? "en" : "ar")}
      >
        <View
          style={[
            styles.toggleCircle,
            isRTL ? styles.toggleCircleRTL : styles.toggleCircleLTR,
          ]}
        />
        <Text style={[styles.switchText, { marginLeft: isRTL ? 5 : 40 }]}>
          {isRTL ? "AR" : "EN"}
        </Text>
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
    width: 70,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    position: "relative",
  },
  switchRTL: {
    backgroundColor: "#8BC34A",
  },
  switchLTR: {
    backgroundColor: "#2196F3",
  },
  toggleCircle: {
    width: 30,
    height: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    position: "absolute",
    top: 5,
  },
  toggleCircleRTL: {
    right: 5,
  },
  toggleCircleLTR: {
    left: 5,
  },
  switchText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
    zIndex: 1,
  },
});

export default LanguageToggle;
