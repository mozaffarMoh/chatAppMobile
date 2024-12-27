import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import useRTL from "@/custom-hooks/useRTL";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "expo-router";
import { useDelete, usePut } from "@/custom-hooks";
import { endPoint } from "@/api/endPoint";
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import CustomSnackbar from "@/components/CustomSnackbar";
import { ActivityIndicator } from "react-native-paper";
import { base64Image } from "@/constants/base64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { updateProfileSchema } from "@/constants/zodSchema/updateProfileSchema";
import { setIsProfileUpdated } from "@/Slices/isProfileUpdated";
import { useDispatch, useSelector } from "react-redux";
import { setIsReset } from "@/Slices/isReset";
import { RootType } from "@/store";

const MyAccount = () => {
  const navigation = useNavigation();
  const { t }: any = useRTL();
  const dispatch = useDispatch();
  const isReset: any = useSelector((state: RootType) => state.isReset.value);
  const [myData, setMyData]: any = useState(null);
  const [imageURI, setImageURI]: any = useState(null);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false); // State to toggle password visibility
  const [newPasswordVisible, setNewPasswordVisible] = useState(false); // State to toggle password visibility
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData]: any = useState({
    username: "",
    email: "",
    profilePhoto: "",
    oldPassword: "",
    newPassword: "",
  });
  const [handleUpdateProfile, loading, success, errorMessage] = usePut(
    endPoint.updateProfilePhoto + "?userId=" + myData?._id,
    formData
  );

  const [
    handelDeleteUser,
    deleteUserLoading,
    errorMessageDeleteUser,
    successMessageDeleteUser,
  ] = useDelete(endPoint.deleteUser + "?userId=" + myData?._id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  }: any = useForm({
    resolver: zodResolver(updateProfileSchema(formData, t)), // Integrate Zod with React Hook Form
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
            name: "oldPassword",
            placeholder: t("auth.oldPassword"),
            keyboardType: "default",
            secureTextEntry: !oldPasswordVisible,
            isPassword: true, // Custom flag to identify password inputs
          },
          {
            name: "newPassword",
            placeholder: t("auth.newPassword"),
            keyboardType: "default",
            secureTextEntry: !newPasswordVisible,
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
      mediaTypes: "images",
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      let imageBase64 = await base64Image(uri);
      setFormData((prevData: any) => ({
        ...prevData,
        profilePhoto: imageBase64,
      }));
      setImageURI({ uri });
    }
  };

  /* Remove the photo */
  const handleRemovePhoto = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      profilePhoto: "",
    }));
    setImageURI(require("@/assets/images/avatar.png"));
  };
  useFocusEffect(
    useCallback(() => {
      getItemFromStorage("myData", setMyData);
    }, [])
  );

  /* initial the formData values from myData */
  useFocusEffect(
    useCallback(() => {
      if (myData) {
        let imageURL = myData?.profilePhoto
          ? { uri: myData?.profilePhoto }
          : require("@/assets/images/avatar.png");

        setImageURI(imageURL);
        setFormData({
          username: myData?.username,
          email: myData?.email,
          oldPassword: "",
          newPassword: "",
        });

        setValue("username", myData?.username);
      }
    }, [myData])
  );

  // Handle input value change
  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /* visisbility of password */
  const handleVisibility = (name: string) => {
    if (name == "oldPassword") {
      setOldPasswordVisible((prev) => !prev);
    } else {
      setNewPasswordVisible((prev) => !prev);
    }
  };

  /* success status */
  useEffect(() => {
    if (success) {
      setSuccessMessage(t("messages.successUpdateProfile"));
      let myDataUpdated = {
        ...myData,
        ...(formData?.profilePhoto
          ? { profilePhoto: formData?.profilePhoto }
          : {}),
        username: formData?.username,
      };

      dispatch(setIsProfileUpdated(true));

      AsyncStorage.setItem("myData", JSON.stringify(myDataUpdated));

      setFormData((prevData: any) => {
        return { ...prevData, oldPassword: "", newPassword: "" };
      });

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [success]);

  const handelDeleteAccount = () => {
    Alert.alert(
      t("alerts.deleteAccount"), // Alert title
      t("alerts.confirmDeleteAccount"), // Alert message
      [
        { text: t("alerts.cancel"), style: "cancel" },
        {
          text: t("alerts.confirm"),
          style: "destructive",
          onPress: () => {
            handelDeleteUser(); // Add actual logout logic here
          },
        },
      ]
    );
  };

  /* reset all states */
  useEffect(() => {
    if (isReset) {
      handleReset();
    }
  }, [isReset]);

  /* reset all states function */
  const handleReset = () => {
    dispatch(setIsReset(false));
    reset();
    setMyData(null);
    setImageURI(null);
    setFormData({
      username: "",
      email: "",
      profilePhoto: "",
      oldPassword: "",
      newPassword: "",
    });
  };

  return (
    <View style={styles.container}>
      <CustomSnackbar
        visible={Boolean(errorMessage) || Boolean(errorMessageDeleteUser)}
        message={errorMessage || errorMessageDeleteUser}
      />
      <CustomSnackbar
        type="success"
        visible={Boolean(successMessage) || Boolean(successMessageDeleteUser)}
        message={successMessage || successMessageDeleteUser}
        onDismiss={() => setSuccessMessage("")}
      />
      {/* Profile Image */}
      <TouchableOpacity
        onPress={handleImageUpload}
        style={styles.imageContainer}
      >
        {imageURI ? (
          <Image source={imageURI} style={styles.profilePhoto} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.uploadText}>{t("buttons.uploadPhoto")}</Text>
          </View>
        )}
      </TouchableOpacity>
      {/* Remove Photo Button */}
      {imageURI != 29 && (
        <TouchableOpacity
          onPress={handleRemovePhoto}
          style={styles.removeButton}
        >
          <Text style={styles.removeText}>{t("buttons.remove")}</Text>
        </TouchableOpacity>
      )}
      {/* Email */}
      <Text style={styles.email}>{formData?.email}</Text>
      {/* Name Input */}
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
                  onChangeText={(value) => {
                    handleInputChange(input.name, value);
                    onChange(value);
                  }}
                />
                {/* Add an eye icon for password fields */}
                {input.isPassword && (
                  <TouchableOpacity
                    onPress={() => handleVisibility(input.name)}
                    style={styles.iconContainer}
                  >
                    <Icon
                      name={
                        oldPasswordVisible ? "eye-outline" : "eye-off-outline"
                      } // Toggle eye icons
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
      {/* Note */}
      {myData?.isGoogle && (
        <Text style={styles.note}>{t("messages.cantChangePassword")}</Text>
      )}
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handleUpdateProfile)}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" /> // Spinner inside button
          ) : (
            <Text style={styles.buttonText}>{t("buttons.update")}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handelDeleteAccount}
        >
          {deleteUserLoading ? (
            <ActivityIndicator size="small" color="#a00" /> // Spinner inside button
          ) : (
            <Text style={styles.buttonText}>
              {t("buttons.deleteMyAccount")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#312",
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
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
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
