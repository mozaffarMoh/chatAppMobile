import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Image, StyleSheet, Text, View } from "react-native";
import { Surface } from "react-native-paper";

export const SingleChatItem = ({ item, myData, receiverImage }: any) => {
  const isSender = item?.sender === myData?._id;
  const isAudio = item?.isAudio === true;
  const backgroundColor = isSender ? primaryColor : thirdColor;
  const alignSelf = isSender ? "flex-start" : "flex-end";

  const isImageExist = (data: any) => {
    if (typeof data == "string") return { uri: data };

    return data?.profilePhoto
      ? { uri: data?.profilePhoto }
      : require("@/assets/images/avatar.png");
  };
  const imageURL = isSender
    ? isImageExist(myData)
    : isImageExist(receiverImage);

  return (
    <Surface
      style={[
        styles.chatContainer,
        {
          direction: item.dir,
          backgroundColor,
          alignSelf,
        },
      ]}
    >
      <Image source={imageURL} style={styles.profileImage} />

      <View>
        <Text style={styles.message}>{isAudio ? "Audio" : item.message}</Text>
        <Text style={styles.time}>{item.timestamp}</Text>
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
