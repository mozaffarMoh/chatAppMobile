import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View, Alert, Button } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

let recording: any = new Audio.Recording();

const RecordingAudio = ({
  isVisible,
  handleCloseModal,
  setMessage,
  handleSendMessage,
  setDuration,
  isRTL,
}: any) => {
  const [recordTime, setRecordTime] = useState({ minutes: 0, seconds: 0 });
  const [isReadyToSentAudio, setIsReadyToSentAudio] = useState(false);

  /* Start the timer */
  useEffect(() => {
    startRecording();
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

  async function startRecording() {
    if (recording) {
      recording._cleanupForUnloadedRecorder();
      recording = null;
    }
    try {
      recording = new Audio.Recording();
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    const status = await recording.getStatusAsync();
    const durationMillis = status.durationMillis;

    setDuration(durationMillis / 1000);
    const base64Audio: any = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    setMessage(`data:audio/webm;base64,${base64Audio}`);
    setIsReadyToSentAudio(true);
  }

  /* Close the modal */
  const handleClose = async () => {
    await recording._cleanupForUnloadedRecorder();
    handleCloseModal();
    setRecordTime({ minutes: 0, seconds: 0 });
  };

  useEffect(() => {
    if (isReadyToSentAudio) {
      handleSendMessage();
      setIsReadyToSentAudio(false);
      handleClose();
    }
  }, [isVisible, isReadyToSentAudio]);

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
