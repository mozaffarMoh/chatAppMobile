import { useColor } from "@/custom-hooks/useColor";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Services = () => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language == "ar";
  const [num, setNum] = useState<any>(0);
  const textColor = useColor("normal");

  const handleChangeValue = (e: any) => {
    const val = e.target.value;
    const numericValue = val ? parseInt(val) : 0;
    if (!isNaN(numericValue)) {
      setNum(numericValue);
    } else {
      Alert.alert("Invalid number!", "number should be not string", [
        {
          text: "Confirm",
          style: "destructive",
          onPress: (val) => {
            console.log(val);
          },
        },
      ]);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        height: "100%",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <Text variant="headlineSmall" style={{ textAlign: "center" }}>
        الخدمات
      </Text>
      <View>
        <TextInput
          placeholder="Enter your name"
          value={num}
          onChange={handleChangeValue}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.containerImage}>
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/images/favicon.png")}
        />
      </View>

      <View>
        <Text style={{ color: textColor }}>
          name: <Text style={{ color: textColor }}>Mozaffar</Text>
        </Text>
      </View>

      <Animated.View style={styles.navigateButton}>
        <Pressable
          style={styles.pressed}
          onPress={() =>
            router.push({
              pathname: "/screens/Screen1",
              params: { userId: "123", name: "John" },
            })
          }
        >
          <Text style={{ color: "blue" }}>Navigate</Text>
          <Ionicons
            name="arrow-forward-circle-outline"
            size={32}
            color="blue"
          />
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    width: "100%",
    height: 200,
    padding: 20,
  },
  tinyLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  pressed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  navigateButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
    right: 5,
    zIndex: 1,
  },
});

export default Services;
