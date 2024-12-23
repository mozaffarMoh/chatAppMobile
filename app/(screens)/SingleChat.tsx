import { endPoint } from "@/api/endPoint";
import { ChatInputFooter } from "@/components/ChatInputFooter";
import { SingleChatItem } from "@/components/SingleChatItem";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import { useGet, useSQList } from "@/custom-hooks";
import useRTL from "@/custom-hooks/useRTL";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const { t, direction }: any = useRTL();
  const navigation = useNavigation();
  let params: any = useLocalSearchParams();
  const [myData, setMyData]: any = useState(null);
  const [page, setPage]: any = useState(1);
  const [isFirstRender, setIsFirstRender]: any = useState(false);
  const [messages, loading, getMessages, success, , setMessages] = useGet(
    endPoint.allMessages +
      `?userId=${params?.userId}&receiverId=${params?.receiverId}&page=${
        page //!messagesCache ? 1 : page
      }`
  );
  const [messagesCache]: any = useSQList(
    messages?.messages,
    getMessages,
    `messages${params?.receiverId}`,
    isFirstRender
  );
  console.log(messagesCache?.length);

  /* handle go back */
  const handleGoBack = () => {
    setIsFirstRender(false);
    router.push({ pathname: "/" });
  };

  /* first page inital */
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <Text style={{ fontSize: 20 }}>{params["username"] || ""}</Text>
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
          onPress={handleGoBack}
        />
      ),
    });
  }, [navigation, params]);

  useFocusEffect(
    useCallback(() => {
      !myData && getItemFromStorage("myData", setMyData);
    }, [])
  );

  //console.log("my data : ", myData);

  /* initil the first mount */
  useFocusEffect(
    useCallback(() => {
      setMessages({ messages: [], total: 0 });
      setPage(1);
      setIsFirstRender(true);
    }, [])
  );

  useEffect(() => {
    getMessages();
  }, [page, isFirstRender]);

  const handleLoadMore = () => {
    let usersLength = messages?.messages?.length;
    let total = messages?.total;
    if (total && usersLength < total) {
      setPage((prev: number) => prev + 1);
    }
  };

  /* Show loading on center */
  if (loading && !messagesCache?.length) {
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
    <View style={styles.container}>
      <FlatList
        data={messagesCache?.length ? messagesCache : messages?.messages}
        renderItem={({ item }: any) => (
          <SingleChatItem
            item={item}
            myData={myData}
            direction={direction}
            {...params}
          />
        )}
        keyExtractor={(item: any) => item?._id}
        style={[styles.flatList]}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end", // Centers content if empty
        }}
        onStartReached={handleLoadMore}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t("messages.hello")} 🚀</Text>
          </View>
        }
        ListHeaderComponent={
          loading ? <ActivityIndicator color={"#fff"} /> : null
        }
        ListFooterComponent={ChatInputFooter}
      />
    </View>
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    backgroundColor: secondaryColor,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "white",
    fontSize: 18,
  },
});
