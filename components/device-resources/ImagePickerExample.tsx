import { useRef, useState } from "react";
import { Text, Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <Text style={{ color: "blue" }}>Loading...</Text>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <View>
          <Image source={{ uri: image }} style={styles.image} />

          <Button title="Clear" onPress={() => setImage(null)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
