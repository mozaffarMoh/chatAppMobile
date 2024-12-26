import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View, Alert, Button } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const RecordingAudio = ({
  isVisible,
  handleCloseModal,
  message,
  setMessage,
  handleSendMessage,
  setDuration,
  isRTL,
}: any) => {
  const [recordTime, setRecordTime] = useState({ minutes: 0, seconds: 0 });
  const [recording, setRecording]: any = useState(undefined);
  const [permissionResponse, requestPermission]: any = Audio.usePermissions();

  /* Start the timer */
  useEffect(() => {
    let intervalId: any;
    if (isVisible) {
      intervalId = setInterval(() => {
        setRecordTime((prev) => {
          let newMinutes = prev.minutes;
          let newSeconds = prev.seconds + 1;

          if (newSeconds >= 60) {
            newMinutes += 1;
            newSeconds = 0;
          }

          return { minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isVisible]);

  /* Start recording */
  const startRecording = async () => {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Configure audio settings
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording }: any = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
        .then((res) => {
          console.log("res : ", res);
        })
        .catch((err) => {
          console.log("err : ", err);
        });
      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  /* Stop and save recording */
  const stopAndSaveRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();

      // Get record URI
      const uri = recording.getURI();
      if (!uri) return;

      // Convert to base64
      const base64Audio: any = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save base64 audio in the `setMessage` state
      setMessage(`data:audio/webm;base64,${base64Audio}`);
      handleClose();
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
  }

  /* Close the modal */
  const handleClose = async () => {
    //await recording.stopAndUnloadAsync();
    //setRecord(null);
    handleCloseModal();
    setRecordTime({ minutes: 0, seconds: 0 });
  };

  useEffect(() => {
    if (message && isVisible) {
      handleSendMessage();
    }
  }, [isVisible, message]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Send Icon */}
          <Ionicons
            name="send"
            size={25}
            color={secondaryColor}
            onPress={stopRecording}
            style={{
              transform: isRTL ? [{ rotate: "180deg" }] : [{ rotate: "0deg" }],
            }}
          />

          {/* Animation */}
          <LottieView
            source={require("../assets/animations/recording.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Ionicons
            name={recording ? "stop-circle" : "play-circle"}
            size={30}
            onPress={() => (recording ? stopRecording() : startRecording())}
          />

          {/* Timer */}
          <Text style={styles.recordTimer}>
            {`${recordTime.minutes < 10 ? "0" : ""}${recordTime.minutes}:${
              recordTime.seconds < 10 ? "0" : ""
            }${recordTime.seconds}`}
          </Text>

          {/* Trash Icon */}
          <Ionicons
            name="trash"
            size={23}
            color={"#f50"}
            onPress={handleClose}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    backgroundColor: "#f000",
  },
  modalContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 250,
    backgroundColor: "#222",
    gap: 20,
  },
  animation: {
    width: 50,
    height: 50,
  },
  recordTimer: {
    color: "white",
    fontSize: 16,
  },
  startButtonContainer: {
    position: "absolute",
    bottom: 50,
    right: 20,
  },
});

export default RecordingAudio;
