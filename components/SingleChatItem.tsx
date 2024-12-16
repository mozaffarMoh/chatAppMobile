import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Image, StyleSheet, Text, View } from "react-native";
import { Surface } from "react-native-paper";

export const SingleChatItem = ({ item }: any) => {
  const backgroundColor = item.dir == "rtl" ? primaryColor : thirdColor;
  const alignSelf = item.dir == "rtl" ? "flex-start" : "flex-end";
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
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/men/10.jpg" }}
        style={styles.profileImage}
      />

      <View>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
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