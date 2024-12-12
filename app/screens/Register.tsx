import React, { useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import LanguageToggle from "@/components/LanguageToggle";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons for the eye icons
import useRTL from "@/custom-hooks/useRTL";

const Register = () => {
  const { width, height } = useWindowDimensions();
  const { t }: any = useRTL();

  const [formData, setFormData]: any = useState({
    email: "",
    password: "",
    photo: null,
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const fields = [
    {
      name: "username",
      placeholder: t("auth.username"),
      keyboardType: "default",
    },
    {
      name: "email",
      placeholder: t("auth.email"),
      keyboardType: "email-address",
    },
    {
      name: "password",
      placeholder: t("auth.password"),
      secureTextEntry: !passwordVisible, // Dynamically set secureTextEntry based on visibility
    },
  ];

  const handleInputChange = (name: any, value: any) => {
    setFormData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prevData: any) => ({
        ...prevData,
        photo: result.assets[0].uri,
      }));
    }
  };

  const handleDeletePhoto = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      photo: null,
    }));
  };

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ScrollView>
        <ImageBackground
          source={require("../../assets/images/register.jpg")} // Add your background image
          style={[styles.background, { height: height - 20 }]}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>{t("auth.welcome")}</Text>
            <Text style={styles.subheading}>{t("auth.happyToJoin")}</Text>

            {/* Dynamic Inputs */}
            {fields.map((field: any, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor="#eeeeee"
                  keyboardType={field.keyboardType || "default"}
                  secureTextEntry={field.secureTextEntry || false}
                  autoCapitalize="none"
                  value={formData[field.name]}
                  onChangeText={(value) => handleInputChange(field.name, value)}
                />
                {/* Add the eye icon for password visibility toggle */}
                {field.name === "password" && (
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Icon
                      name={passwordVisible ? "eye-outline" : "eye-off-outline"} // Toggle eye icons
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Photo Upload */}
            <TouchableOpacity
              style={styles.photoButton}
              onPress={handlePhotoUpload}
            >
              <Text style={styles.photoButtonText}>
                {formData.photo ? t("auth.changePhoto") : t("auth.uploadPhoto")}
              </Text>
            </TouchableOpacity>
            {formData.photo && (
              <>
                <Image
                  source={{ uri: formData.photo }}
                  style={styles.photoPreview}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeletePhoto}
                >
                  <MaterialIcons name="delete" size={24} color="#FF0000" />
                </TouchableOpacity>
              </>
            )}

            {/* Register Button */}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>{t("auth.register")}</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <Text style={styles.signup}>
              {t("auth.haveAccount")}
              <Text
                style={styles.signupLink}
                onPress={() => router.push("/screens/Login")}
              >
                {" "}
                {t("auth.signIn")}
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
  inputContainer: {
    width: "100%",
    position: "relative",
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
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  button: {
    backgroundColor: "#4CAF50", // Green color for the register button
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
  photoButton: {
    backgroundColor: "#2196F3", // Blue color for the photo upload button
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderColor: "#fff",
    borderWidth: 2,
  },
  signup: {
    color: "#fff",
    fontSize: 14,
  },
  signupLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#4CAF50", // Semi-transparent red background
    borderRadius: 5,
    padding: 4,
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Register;
