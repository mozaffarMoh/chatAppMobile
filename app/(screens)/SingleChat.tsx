import { SingleChatItem } from "@/components/SingleChatItem";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Surface } from "react-native-paper";

const chatData = [
  {
    message:
      "Hi Mozaffer Hi Mozaffer Hi Mozaffer Hi Mozaffer Mozaffer Hi Mozaffer Mozaffer Hi Mozaffer",
    time: "02:30 PM",
    dir: "ltr",
  },
  { message: "Hello Ahmed", time: "02:35 PM", dir: "rtl" },
  { message: "Hi Mozaffer", time: "02:30 PM", dir: "rtl" },
  { message: "Hello Ahmed", time: "02:35 PM", dir: "rtl" },
  {
    message:
      "Hi Mozaffer  Mozaffer Hi Mozaffer Hi Mozaffer Hi Mozaffer Mozaffer Hi  Mozaffer Hi Mozaffer Hi Mozaffer Hi Mozaffer Mozaffer Hi ",
    time: "02:30 PM",
    dir: "rtl",
  },
  { message: "Hello Ahmed", time: "02:35 PM", dir: "ltr" },
  { message: "Hi Mozaffer", time: "02:30 PM", dir: "rtl" },
  { message: "Hello Ahmed", time: "02:35 PM", dir: "ltr" },
  { message: "Hi Mozaffer sssssss sssssssss", time: "02:30 PM", dir: "rtl" },
  { message: "Hello Ahmed", time: "02:35 PM", dir: "rtl" },
  { message: "Hello Ahmed", time: "02:35 PM", dir: "ltr" },
  { message: "Hi Mozaffer", time: "02:30 PM", dir: "rtl" },
  { message: "Hello Ahmed", time: "02:35 PM", dir: "ltr" },
  { message: "Hello Ahmed", time: "02:35 PM", dir: "rtl" },
  { message: "Hi Mozaffer", time: "02:30 PM", dir: "rtl" },
  { message: "Hello Ahmed", time: "02:35 PM", dir: "ltr" },
];

const SingleChat = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <Text>{params["name"] || ""}</Text>,
      headerStyle: {
        backgroundColor: secondaryColor, // Set the background color to green
      },
      headerRight: () => (
        <View
          style={{
            backgroundColor: secondaryColor,
            flexDirection: "row",
            gap: 15,
            marginRight: 15,
            marginHorizontal: 10,
          }}
        >
          <Ionicons
            size={28}
            name="videocam"
            color={primaryColor}
            style={{ backgroundColor: secondaryColor }}
          />

          <Ionicons
            size={28}
            name="call"
            color={thirdColor}
            style={{ backgroundColor: secondaryColor }}
          />
        </View>
      ),
      headerLeft: () => (
        <Ionicons
          size={35}
          name="arrow-back-circle"
          style={{ marginHorizontal: 10 }}
          color={thirdColor}
          onPress={() => router.push("/")}
        />
      ),
    });
  }, [navigation, params]);

  return (
    <FlatList
      data={chatData}
      renderItem={SingleChatItem}
      // keyExtractor={(item) => item.id}
      style={[styles.flatList, { direction: "rtl" }]}
    />
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: secondaryColor,
  },
});
