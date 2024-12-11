import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export default function CameraComponent() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null); // Ref to access the camera

  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Store captured image URI

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

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // Function to capture the image
  async function captureImage() {
    if (cameraRef.current) {
      const photo: any = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri); // Save the captured image URI
    }
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={captureImage}>
              <Text style={styles.text}>Capture Image</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          <TouchableOpacity style={styles.button} onPress={() => setCapturedImage(null)}>
              <Text style={styles.text}>Clear</Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40,
    width: "100%",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    width:100,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  imageContainer: {
    position: "absolute",
    top: 20,
  },
  capturedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
