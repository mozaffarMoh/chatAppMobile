import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native"; // For enhanced animation
import { secondaryColor } from "@/constants/colors"; // Make sure you import your color constants
import { Redirect, useNavigation } from "expo-router";
import { useAuth } from "@/Context/AuthProvider"

const LoadingScreen = () => {
  const { isAuth }: any = useAuth();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);


  if (isAuth === false) {
    return <Redirect href="/(screens)/Login" />;
  } else if (isAuth === true) {
    return <Redirect href="/" />;
  } else {
    return (
      <View style={styles.container}>
        <LottieView
          source={require("@/assets/animations/loading.json")} // Your custom Lottie animation file
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
  },
  animation: {
    width: 150, // Set size for the Lottie animation
    height: 150,
  },
});

export default LoadingScreen;
