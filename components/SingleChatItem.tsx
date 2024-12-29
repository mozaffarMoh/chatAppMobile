import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Animated, Button, Image, StyleSheet, Text, View } from "react-native";
import { Surface } from "react-native-paper";
import dayjs from "dayjs";
import { Audio } from "expo-av";
import { memo, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

let sound: Audio.Sound | undefined;

const SingleChatItem = ({ item, myData, direction, receiverImage }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const soundInstanceRef = useRef<Audio.Sound | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const [lastPosition, setLastPosition] = useState(0);
  const isAudio = item?.isAudio === true;
  const isSender = item?.sender === myData?._id;
  const backgroundColor = isSender ? primaryColor : thirdColor;
  const position = direction == "ltr" ? "flex-end" : "flex-start";
  const reversePosition = direction == "ltr" ? "flex-start" : "flex-end";
  const reverseDirection = direction == "ltr" ? "rtl" : "ltr";

  const isImageExist = (data: any) => {
    if (typeof data == "string" && data) return { uri: data };

    return data?.profilePhoto
      ? { uri: data?.profilePhoto }
      : require("@/assets/images/avatar.png");
  };
  const imageURL = isSender
    ? isImageExist(myData)
    : isImageExist(receiverImage);

  const handlePlayAudio = async (base64Audio: string) => {
    try {
      if (sound && currentMessageId === item?._id) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          // Resume from last position if available
          await sound.playFromPositionAsync(lastPosition);
          setIsPlaying(true);
          return;
        }
      }
      setCurrentMessageId(item?._id);
      const soundInstance = new Audio.Sound();
      const cleanedBase64Audio = base64Audio.replace(
        /^data:audio\/\w+;base64,/,
        ""
      );
      const fileUri = `${FileSystem.cacheDirectory}temp-audio.mp3`;
      await FileSystem.writeAsStringAsync(fileUri, cleanedBase64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // Load the audio file
      const status: any = await soundInstance.loadAsync({ uri: fileUri });

      // Check if the audio was successfully loaded
      if (!status.isLoaded) {
        throw new Error("Audio failed to load.");
      }

      // Play the audio
      await soundInstance.playAsync();
      sound = soundInstance;
      setIsPlaying(true);

      // Monitor playback progress
      soundInstance.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis / 1000);
          progress.setValue(status.positionMillis / status.durationMillis); // Set the value directly

          if (status.didJustFinish) {
            setIsPlaying(false);
            sound = undefined;
            progress.setValue(0);
          }
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handlePauseAudio = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setLastPosition(status.positionMillis); // Save the current position
        await sound.pauseAsync(); // Pause instead of stopping
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Clean up the sound instance on unmount
      if (soundInstanceRef.current) {
        soundInstanceRef.current.unloadAsync();
        soundInstanceRef.current = null;
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <Surface
      style={[
        styles.chatContainer,
        {
          //shadowColor: "transparent",
          direction: isSender ? direction : reverseDirection,
          backgroundColor,
          alignSelf: isSender ? reversePosition : position,
        },
      ]}
    >
      <Image source={imageURL} style={styles.profileImage} />

      <View>
        {isAudio ? (
          <View style={styles.audioContainer}>
            <Ionicons
              name={isPlaying ? "stop-circle" : "play-circle"}
              size={35}
              onPress={
                isPlaying
                  ? handlePauseAudio
                  : () => handlePlayAudio(item?.message)
              }
              color={"#333"}
            />
            {/* Progress Bar and time*/}
            <View style={styles.progressAndTimeContainer}>
              <View style={styles.progressContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
              <Text>
                {formatTime(isPlaying ? currentTime : item?.duration)}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.message}>{item?.message}</Text>
        )}
        <Text style={styles.time}>
          {dayjs(item.timestamp).format("DD-MM-YYYY || hh:mm a")}
        </Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    padding: 7,
    gap: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#5544ff",
  },
  message: {
    color: "white",
    maxWidth: "96%",
  },
  time: {
    color: "#eeeeee",
    fontSize: 9,
    marginTop: 4,
  },
  audioContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },
  progressAndTimeContainer: {
    gap: 3,
    width: "70%",
  },
  progressContainer: {
    height: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#333",
    borderRadius: 5,
  },
});

export default memo(SingleChatItem);
