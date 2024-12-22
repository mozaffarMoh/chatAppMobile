import { endPoint } from "@/api/endPoint";
import { ChatInputFooter } from "@/components/ChatInputFooter";
import { SingleChatItem } from "@/components/SingleChatItem";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import { useGet } from "@/custom-hooks";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

const SingleChat = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [myData, setMyData]: any = useState(1);
  const [page, setPage]: any = useState(1);
  const [messages, loading, getMessages, success, , setMessages] = useGet(
    endPoint.allMessages +
      `?userId=${params?.userId}&receiverId=${params?.receiverId}&page=${
        page //!messagesCache[receiverId] ? 1 : page
      }`
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <Text style={{ fontSize: 20 }}>{params["name"] || ""}</Text>
      ),
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

  /* get user id from storage */
  useFocusEffect(
    useCallback(() => {
      getItemFromStorage("myData", setMyData);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      setMessages([]);
      page > 1 ? setPage(1) : getMessages();
    }, [])
  );

  useEffect(() => {
    getMessages();
  }, [page]);

  const handleLoadMore = () => {
    let usersLength = messages?.messages?.length;
    let total = messages?.total;
    if (total && usersLength < total) {
      setPage((prev: number) => prev + 1);
    }
  };

  if (loading && messages.length == 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: secondaryColor,
        }}
      >
        <ActivityIndicator color={"#fff"} />
      </View>
    );
  }

  return (
    <FlatList
      data={messages?.messages}
      renderItem={({ item }: any) => (
        <SingleChatItem item={item} myData={myData} {...params} />
      )}
      keyExtractor={(item: any) => item?._id}
      style={[styles.flatList, { direction: "rtl" }]}
      onStartReached={handleLoadMore}
      ListHeaderComponent={
        loading ? <ActivityIndicator color={"#fff"} /> : null
      }
      ListFooterComponent={ChatInputFooter}
    />
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: secondaryColor,
  },
});
