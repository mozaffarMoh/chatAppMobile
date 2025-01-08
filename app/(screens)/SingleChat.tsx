import { endPoint } from "@/api/endPoint";
import { ChatInputFooter } from "@/components/ChatInputFooter";
import SingleChatItem from "@/components/SingleChatItem";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import { useGet } from "@/custom-hooks";
import useRTL from "@/custom-hooks/useRTL";
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
  View,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
  State,
} from "react-native-gesture-handler";
import MessageUpdate from "@/components/MessageUpdate";
import CallSection from "@/components/CallSection";
import { setIsUsersRefresh } from "@/Slices/refreshUsers";
import { useDispatch } from "react-redux";
import { playReceiveMessageSound } from "@/constants/soundsFiles";
import { useSelector } from "react-redux";
import { RootType } from "@/store";
import { useMessagesCache } from "@/Context/MessagesProvider";
import { useSocket } from "@/Context/SocketRefProvider";
import useSocketMonitor from "@/custom-hooks/useSocketMonitor";
import { io, Socket } from "socket.io-client";

const SingleChat = () => {
  const { t, direction }: any = useRTL();
  const [myData, setMyData]: any = useState(null);
  const { socketRef, isMessageReceived, setIsMessageReceived } =
    useSocketMonitor();
  const { messagesCache, setMessagesCache }: any = useMessagesCache();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  let params: any = useLocalSearchParams();
  const [page, setPage]: any = useState(2);
  const [isFirstRender, setIsFirstRender]: any = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [readyToGetMessages, setReadyToGetMessages]: any = useState(false);
  const [showMesseageUpdate, setShowMesseageUpdate]: any = useState(false);
  const [isAudioCall, setIsAudioCall]: any = useState(false);
  const [isVideoCall, setIsVideoCall]: any = useState(false);
  const [isCallStart, setIsCallStart] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null); // Ref for FlatList
  const [name, setName] = useState<string>("");
  const [caller, setCaller] = useState<string>("");
  const [callerSignal, setCallerSignal] = useState<object | null>(null);
  const [stream, setStream]: any = useState<object | null>(null);
  const [isReceiveCall, setIsReceiveCall] = useState<boolean>(false);
  const [receiverImage, setReceiverImage]: any = useState(null);
  const [receiverId, setReceiverId]: any = useState("");
  const [isFirstGetMessages, setIsFirstGetMessages] = useState(false); // Tracks if we've scrolled initially
  const [messageToUpdate, setMessageToUpdate]: any = useState({
    _id: "",
    message: "",
  });
  const [messages, loading, getMessages, success, , setMessages] = useGet(
    endPoint.allMessages +
      `?userId=${params?.userId}&receiverId=${params?.receiverId}&page=${page}`
  );

  const usersFromRedux: any = useSelector(
    (state: RootType) => state.usersSlice.users
  );

  /* handle go back */
  const handleGoBack = () => {
    setIsFirstRender(false);
    setIsFirstGetMessages(false);
    setReceiverImage(null);
    setReceiverId("");
    setPage(2);
    setMessages({ messages: [], total: 0 });
    router.push("/");
  };

  // Check the network status
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = NetInfo.addEventListener((state: any) => {
        setIsOnline(state.isConnected);
      });
      return () => unsubscribe(); // Clean up the listener
    }, [])
  );

  /* first page inital */
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontWeight: 700, color: "#333" }}>
          {params["username"] || ""}
        </Text>
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
            name="call"
            color={thirdColor}
            style={{ backgroundColor: secondaryColor }}
            onPress={() => handleShowCall("audio")}
          />
          <Ionicons
            size={32}
            name="videocam"
            color={primaryColor}
            style={{ backgroundColor: secondaryColor }}
            onPress={() => handleShowCall("video")}
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

  /* initil the first mount */
  useFocusEffect(
    useCallback(() => {
      setIsFirstRender(true);
    }, [])
  );

  useEffect(() => {
    if (isFirstRender) {
      setReceiverId(params?.receiverId);
    }
  }, [isFirstRender]);

  useEffect(() => {
    if (receiverId === params?.receiverId) {
      if (!messagesCache?.[receiverId]) {
        getMessages();
      } else {
        let savedPage = messagesCache?.[receiverId]?.page;
        page < savedPage && setPage(savedPage);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 500);
      }
    }
  }, [receiverId]);

  useEffect(() => {
    if (
      messagesCache?.[receiverId] &&
      page > messagesCache?.[receiverId]?.page
    ) {
      getMessages();
    }
  }, [page]);

  const handleLoadMore = () => {
    let total = messagesCache?.[receiverId]?.total;
    let messagesLength = messagesCache?.[receiverId]?.messages?.length;
    let isCanLoad = total && messagesLength < total;

    if (isCanLoad) {
      setPage((prev: number) => prev + 1);
    }
  };

  /* is message sent recall the messages */
  useFocusEffect(
    useCallback(() => {
      if (readyToGetMessages) {
        setReadyToGetMessages(false);
        getMessages();
      }
    }, [readyToGetMessages])
  );

  /* if user receive a message recall the messages */
  useEffect(() => {
    if (isMessageReceived) {
      playReceiveMessageSound();
      setIsMessageReceived(false);
      getMessages();
    }
  }, [isMessageReceived]);

  const handleShowCall = (type: string) => {
    if (!isCallStart) {
      setIsCallStart(true);
      type == "audio" && setIsAudioCall(true);
      type == "video" && setIsVideoCall(true);
    }
  };

  /* Search for receiver image in redux */
  useFocusEffect(
    useCallback(() => {
      usersFromRedux.forEach((ele: any) => {
        if (ele?._id === params?.receiverId) {
          setReceiverImage(ele?.profilePhoto);
        }
      });
    }, [isFirstRender])
  );

  /* refersh users and scroll to bottom when first success */
  useEffect(() => {
    if (success) {
      if (params?.receiverId === receiverId && isFirstRender) {
        setMessagesCache({
          ...messagesCache,
          [receiverId]: {
            messages: messages?.messages,
            page: page,
            total: messages?.total,
          },
        });
      }

      if (!isFirstGetMessages || isMessageReceived) {
        dispatch(setIsUsersRefresh(true));
        isMessageReceived && setIsMessageReceived(false);
        !isFirstGetMessages && setIsFirstGetMessages(true);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 500);
      }
    }
  }, [success]);

  const onHoldItemToUpdate = (nativeEvent: any, item: any) => {
    if (nativeEvent.state === State.ACTIVE && item?.sender === myData?._id) {
      setShowMesseageUpdate(true);
      setMessageToUpdate({
        _id: item?._id,
        message: item?.isAudio ? "" : item?.message,
      });
    }
  };

  /* Show loading on center */
  if (loading && !messages?.messages?.length) {
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
  } else {
    return receiverId === params?.receiverId && messagesCache?.[receiverId] ? (
      <View style={styles.container}>
        <GestureHandlerRootView>
          <FlatList
            ref={flatListRef}
            data={messagesCache?.[receiverId]?.messages}
            renderItem={({ item }: any) => (
              <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) =>
                  onHoldItemToUpdate(nativeEvent, item)
                }
              >
                <View
                  style={{
                    backgroundColor:
                      item?._id == messageToUpdate?._id
                        ? thirdColor + "88"
                        : secondaryColor,
                  }}
                >
                  <SingleChatItem
                    item={item}
                    myData={myData}
                    direction={direction}
                    receiverImage={receiverImage}
                    {...params}
                  />
                </View>
              </LongPressGestureHandler>
            )}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
            keyExtractor={(item: any) => item?._id}
            style={[styles.flatList]}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end", // Centers content if empty
            }}
            onStartReached={handleLoadMore}
            onStartReachedThreshold={0.1}
            ListEmptyComponent={
              success && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t("messages.hello")} 🚀</Text>
                </View>
              )
            }
            ListHeaderComponent={
              loading ? <ActivityIndicator color={"#fff"} /> : null
            }
          />
        </GestureHandlerRootView>
        {/* ChatInputFooter moved here */}
        <ChatInputFooter
          direction={direction}
          t={t}
          {...params}
          setReadyToGetMessages={setReadyToGetMessages}
          socketRef={socketRef}
          myData={myData}
        />

        <MessageUpdate
          t={t}
          messageToUpdate={messageToUpdate}
          setMessageToUpdate={setMessageToUpdate}
          isVisible={showMesseageUpdate}
          setReadyToGetMessages={setReadyToGetMessages}
          handleCloseModal={() => setShowMesseageUpdate(false)}
        />

        <CallSection
          t={t}
          isVisible={isAudioCall || isVideoCall}
          isAudioCall={isAudioCall}
          isVideoCall={isVideoCall}
          handleCloseModal={
            isAudioCall
              ? () => setIsAudioCall(false)
              : isVideoCall
                ? () => setIsVideoCall(false)
                : null
          }
          myData={myData}
          name={name}
          caller={caller}
          stream={stream}
          callerSignal={callerSignal}
          isReceiveCall={isReceiveCall}
          isCallStart={isCallStart}
          setIsCallStart={setIsCallStart}
          setIsReceiveCall={setIsReceiveCall}
          {...params}
        />
      </View>
    ) : (
      <View style={styles.subContainer}></View>
    );
  }
};

export default SingleChat;

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    backgroundColor: secondaryColor,
  },
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
