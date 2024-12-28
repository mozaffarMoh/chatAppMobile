import React, { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import LanguageToggle from "@/components/LanguageToggle";
import { Redirect, router, Stack, useNavigation } from "expo-router";
import useRTL from "@/custom-hooks/useRTL";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons for the eye icons
import { usePost } from "@/custom-hooks";
import { endPoint } from "@/api/endPoint";
import CustomSnackbar from "@/components/CustomSnackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginSchema } from "@/constants/zodSchema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod"; // Import Zod resolver for React Hook Form
import { useForm, Controller } from "react-hook-form"; // Import React Hook Form
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { useAuth } from "@/components/AuthProviders";

const Login = () => {
  const { isAuth }: any = useAuth();
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const { t }: any = useRTL();
  const [successMessage, setSuccessMessage] = useState("");
  // Define your input fields dynamically
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [formData, setFormData]: any = useState(null);

  const inputs: any = [
    {
      name: "email",
      placeholder: t("auth.email"),
      keyboardType: "email-address",
      secureTextEntry: false,
    },
    {
      name: "password",
      placeholder: t("auth.password"),
      keyboardType: "default",
      secureTextEntry: !passwordVisible,
      isPassword: true, // Custom flag to identify password inputs
    },
  ];

  const {
    control,
    handleSubmit,

    formState: { errors },
    reset,
  }: any = useForm({
    resolver: zodResolver(loginSchema(t)), // Integrate Zod with React Hook Form
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [handleLoginPost, loading, success, errorMessage] = usePost(
    endPoint.login,
    formData
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Handle input value change
  const onSubmit = (data: any) => {
    setFormData(data);
  };

  useEffect(() => {
    if (formData) handleLoginPost();
  }, [formData]);

  useEffect(() => {
    if (success) {
      setSuccessMessage(t("messages.successLogin"));
      setFormData(null);
      reset();
    }
  }, [success]);

  const [gmailToken, setGmailToken] = React.useState<object | any>(null);
  const [
    handleRegisterWithGoogle,
    googleLoading,
    googleSuccess,
    ,
    ,
    googleSuccessMessage,
  ] = usePost(endPoint.registerGoogle, gmailToken);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Platform.select({
      ios: "202948221783-slvgg9nuv7dl6103vgpop136eej0rnkf.apps.googleusercontent.com",
      android:
        "202948221783-slvgg9nuv7dl6103vgpop136eej0rnkf.apps.googleusercontent.com",
      default:
        "202948221783-slvgg9nuv7dl6103vgpop136eej0rnkf.apps.googleusercontent.com",
    }),
    //this for web :  202948221783-m98hb00hfk2d0v73bqrrev24f0ubui74.apps.googleusercontent.com
    redirectUri: makeRedirectUri({
      scheme: "com.feras123.testlatest",
      native:'android',
      preferLocalhost:true
    }),

  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication) {
        setGmailToken({ token: authentication.accessToken });
        handleRegisterWithGoogle();
      }
    }
  }, [response]);

  if (isAuth === true) {
    return <Redirect href="/" />;
  } else {
    return (
      <SafeAreaView style={{ flexGrow: 1 }}>
        <CustomSnackbar
          visible={Boolean(errorMessage)}
          message={errorMessage}
        />
        <CustomSnackbar
          type="success"
          visible={Boolean(successMessage)}
          message={successMessage}
          onDismiss={() => setSuccessMessage("")}
        />
        <ImageBackground
          source={require("../../assets/images/login.jpg")} // Add your background image
          style={[styles.background, { height: height - 20 }]}
        >
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={styles.container}>
              <Text style={styles.heading}>{t("auth.welcomeBack")}</Text>
              <Text style={styles.subheading}>{t("auth.pleaseSignIn")}</Text>
              {/* Render inputs dynamically */}
              {inputs.map((input: any) => (
                <View key={input.name} style={styles.inputWrapper}>
                  <Controller
                    name={input.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextInput
                          style={[
                            styles.input,
                            errors[input.name] && styles.errorBorder, // Add red border if error
                          ]}
                          placeholder={input.placeholder}
                          placeholderTextColor="#eeeeee"
                          keyboardType={input.keyboardType}
                          secureTextEntry={input.secureTextEntry || false}
                          value={value}
                          onChangeText={onChange}
                        />
                        {input.isPassword && (
                          <TouchableOpacity
                            onPress={() => setPasswordVisible((prev) => !prev)}
                            style={styles.iconContainer}
                          >
                            <Icon
                              name={
                                passwordVisible
                                  ? "eye-outline"
                                  : "eye-off-outline"
                              }
                              size={24}
                              color="#fff"
                            />
                          </TouchableOpacity>
                        )}
                        {errors[input.name] && (
                          <Text style={styles.errorText}>
                            {errors[input.name]?.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" /> // Spinner inside button
                ) : (
                  <Text style={styles.buttonText}>{t("auth.login")}</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.signup}>
                {t("auth.dontHaveAccount")}{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() => router.push("/(screens)/Register")}
                >
                  {t("auth.signUp")}
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.buttonGoogle} // Google red color
                onPress={() => promptAsync()}
                disabled={!request}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#aaa" />
                ) : (
                  <Text style={styles.buttonGoogleText}>
                    {t("auth.loginWithGoogle")}
                  </Text>
                )}
              </TouchableOpacity>

              <LanguageToggle />
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  background: {
    height: 700,
    resizeMode: "cover",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
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
  inputWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#fff",
    borderWidth: Platform.select({ android: 2 }),
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingRight: 45, // Add space for the icon
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  iconContainer: {
    position: "absolute",
    right: 15, // Position the icon inside the TextInput
    top: 12,
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
  buttonGoogle: {
    backgroundColor: "#fff",
    borderRadius: 7,
    marginTop: 20,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGoogleText: {
    textAlign: "center",
    color: "#222",
    fontWeight: "400",
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

export default Login;
