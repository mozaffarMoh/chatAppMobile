import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { Surface } from "react-native-paper";
import dayjs from "dayjs";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

export const SingleChatItem = ({ item, myData, direction,receiverImage }: any) => {
  const isSender = item?.sender === myData?._id;
  const isAudio = item?.isAudio === true;
  const backgroundColor = isSender ? primaryColor : thirdColor;
  const position = direction == "ltr" ? "flex-end" : "flex-start";
  const reversePosition = direction == "ltr" ? "flex-start" : "flex-end";
  const reverseDirection = direction == "ltr" ? "rtl" : "ltr";
  const [currectSound, setCurrentSound]: any = useState(null);

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
      // Define a path for the temporary audio file
      const fileUri = `${FileSystem.cacheDirectory}temp-audio.mp3`;

      // Write the base64 string to a file
      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Load and play the audio
      const { sound } = await Audio.Sound.createAsync({ uri: fileUri });

      setCurrentSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handlePauseAudio = async () => {
    if (currectSound) {
      await currectSound.unloadAsync();
      setCurrentSound(null);
    }
  };
  useEffect(() => {
    return currectSound
      ? () => {
          currectSound.unloadAsync();
        }
      : undefined;
  }, [currectSound]);

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
          direction: isSender ? direction : reverseDirection,
          backgroundColor,
          alignSelf: isSender ? reversePosition : position,
        },
      ]}
    >
      <Image source={imageURL} style={styles.profileImage} />

      <View>
        <Text style={styles.message}>
          {isAudio ? (
            <View>
              <Ionicons
                name={currectSound ? "stop-circle" : "play-circle"}
                size={30}
                onPress={() =>
                  currectSound
                    ? handlePauseAudio()
                    : handlePlayAudio(item?.message)
                }
              />
              <Text>{formatTime(item?.duration)}</Text>
            </View>
          ) : (
            item?.message
          )}
        </Text>
        <Text style={styles.time}>
          {dayjs(item.timestamp).format("DD-MM-YYYY || HH:mm a")}
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
});
