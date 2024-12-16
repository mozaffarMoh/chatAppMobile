import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import useRTL from "@/custom-hooks/useRTL";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { usePut } from "@/custom-hooks";
import { endPoint } from "@/api/endPoint";
import { getItemFromStorage } from "@/constants/getItemFromStorage";

const MyAccount = () => {
  const [name, setName] = useState("Mozaffar Mohammad");
  const navigation = useNavigation();
  const { t }: any = useRTL();
  const [email] = useState("ferawwwess@gmail.com");
  const [myData, setMyData]: any = useState(null);
  const [imageUri, setImageUri]: any = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false); // State to toggle password visibility
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const inputs: any = [
    {
      name: "username",
      placeholder: t("auth.username"),
      keyboardType: "default",
      secureTextEntry: false,
    },
    ...(!myData?.isGoogle
      ? [
          {
            name: "password",
            placeholder: t("auth.password"),
            keyboardType: "default",
            secureTextEntry: !passwordVisible,
            isPassword: true, // Custom flag to identify password inputs
          },
          {
            name: "password-confirm",
            placeholder: t("auth.passwordConfirm"),
            keyboardType: "default",
            secureTextEntry: !passwordConfirmVisible,
            isPassword: true, // Custom flag to identify password inputs
          },
        ]
      : []), // Spread an empty array if `myData?.isGoogle` is falsy
  ];

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: t("header.myAccount"),
    });
  }, [navigation, t]);

  // Image picker handler
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri({ uri: result.assets[0].uri });
    }
  };

  useEffect(() => {
    getItemFromStorage("myData", setMyData);
  }, []);

  useEffect(() => {
    if (myData) {
      setFormData({
        username: myData?.username,
        email: myData?.email,
        password: "",
      });
      let imageURL = myData?.profilePhoto
        ? { uri: myData?.profilePhoto }
        : require("@/assets/images/avatar.png");

      setImageUri(imageURL);
    }
  }, [myData]);

  /*   const [handleUpdateProfile, loading, success, errorMessage] = usePut(
    endPoint.updateProfilePhoto + "?userId=" + userId,
    formData
  );
 */
  // Handle input value change
  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVisibility = (name: string) => {
    if (name == "password") {
      setPasswordVisible((prev) => !prev);
    } else {
      setPasswordConfirmVisible((prev) => !prev);
    }
  };
  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <TouchableOpacity
        onPress={handleImageUpload}
        style={styles.imageContainer}
      >
        {imageUri ? (
          <Image source={imageUri} style={styles.profilePhoto} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.uploadText}>{t("buttons.uploadPhoto")}</Text>
          </View>
        )}
      </TouchableOpacity>
      {/* Remove Photo Button */}
      {imageUri && (
        <TouchableOpacity
          onPress={() => setImageUri(null)}
          style={styles.removeButton}
        >
          <Text style={styles.removeText}>{t("buttons.remove")}</Text>
        </TouchableOpacity>
      )}
      {/* Email */}
      <Text style={styles.email}>{email}</Text>
      {/* Name Input */}
      {inputs.map((input: any) => (
        <View key={input.name} style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={input.placeholder}
            placeholderTextColor="#eeeeee"
            keyboardType={input.keyboardType}
            secureTextEntry={input.secureTextEntry || false}
            value={formData[input.name as keyof typeof formData]}
            onChangeText={(value) => handleInputChange(input.name, value)}
          />
          {/* Add an eye icon for password fields */}
          {input.isPassword && (
            <TouchableOpacity
              onPress={() => handleVisibility(input.name)}
              style={styles.iconContainer}
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
      {/* Note */}
      {myData?.isGoogle && (
        <Text style={styles.note}>{t("messages.cantChangePassword")}</Text>
      )}
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{t("buttons.update")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]}>
          <Text style={styles.buttonText}>{t("buttons.deleteMyAccount")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#778da9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  removeButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  removeText: {
    color: "#e63946",
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 15,
  },

  note: {
    fontSize: 12,
    color: "#8d99ae",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 10, // Adds space between the buttons
  },

  button: {
    backgroundColor: "#007BFF", // Blue for 'UPDATE'
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%", // 100% width
  },

  deleteButton: {
    backgroundColor: "#d62828", // Red for 'Delete My Account'
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyAccount;
