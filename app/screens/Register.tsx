import React from "react";
import { Platform, useWindowDimensions } from "react-native";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import LanguageToggle from "@/components/LanguageToggle";

const Register = () => {
  const { width, height } = useWindowDimensions();
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ScrollView>
        <ImageBackground
          source={require("../../assets/images/register.jpg")} // Add your background image
          style={[styles.background, { height: height - 20 }]}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>{t("auth.welcomeBack")}</Text>
            <Text style={styles.subheading}>{t("auth.pleaseSignIn")}</Text>

            <TextInput
              style={styles.input}
              placeholder={t("auth.email")}
              placeholderTextColor="#A1A1A1"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder={t("auth.password")}
              placeholderTextColor="#A1A1A1"
              secureTextEntry
            />

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>{t("auth.login")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>{t("auth.forgotPassword")}</Text>
            </TouchableOpacity>

            <Text style={styles.signup}>
              {t("auth.dontHaveAccount")}
              <Text
                style={styles.signupLink}
                onPress={() => router.push("/screens/Login")}
              >
                {t("auth.signUp")}
              </Text>
            </Text>

            <LanguageToggle />
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: 700,
    resizeMode: "cover",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#fff",
    borderWidth: Platform.select({ android: 2 }),
    borderRadius: 25,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  button: {
    backgroundColor: "#4CAF50", // Green color for the login button
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginBottom: 20,
  },
  forgotText: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  signup: {
    color: "#fff",
    fontSize: 14,
  },
  signupLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default Register;
