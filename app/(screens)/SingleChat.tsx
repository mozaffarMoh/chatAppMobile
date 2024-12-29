import { endPoint } from "@/api/endPoint";
import { ChatInputFooter } from "@/components/ChatInputFooter";
import SingleChatItem from "@/components/SingleChatItem";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import { useGet, useSQList } from "@/custom-hooks";
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
  Alert,
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
import { chatMessagesExample } from "@/constants/chatMessagesExample";
import CallSection from "@/components/CallSection";
import { io } from "socket.io-client";
import { setIsUsersRefresh } from "@/Slices/refreshUsers";
import { useDispatch } from "react-redux";
import { Audio } from "expo-av";
import { playReceiveMessageSound } from "@/constants/soundsFiles";
import { useSelector } from "react-redux";
import { RootType } from "@/store";

const SingleChat = () => {
  const { t, direction }: any = useRTL();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  let params: any = useLocalSearchParams();
  const [myData, setMyData]: any = useState(null);
  const [page, setPage]: any = useState(2);
  const [isFirstRender, setIsFirstRender]: any = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [readyToGetMessages, setReadyToGetMessages]: any = useState(false);
  const [showMesseageUpdate, setShowMesseageUpdate]: any = useState(false);
  const [isAudioCall, setIsAudioCall]: any = useState(false);
  const [isVideoCall, setIsVideoCall]: any = useState(false);
  const [isCallStart, setIsCallStart] = useState<boolean>(false);
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null); // Ref for FlatList
  const [name, setName] = useState<string>("");
  const [caller, setCaller] = useState<string>("");
  const [callerSignal, setCallerSignal] = useState<object | null>(null);
  const [stream, setStream]: any = useState<object | null>(null);
  const [isReceiveCall, setIsReceiveCall] = useState<boolean>(false);
  const [receiverImage, setReceiverImage]: any = useState(null);
  const [isMessageReceived, setIsMessageReceived] = useState<boolean>(false);
  const [isFirstGetMessages, setIsFirstGetMessages] = useState(false); // Tracks if we've scrolled initially
  const [messageToUpdate, setMessageToUpdate]: any = useState({
    _id: "",
    message: "",
  });
  const [messages, loading, getMessages, success, , setMessages] = useGet(
    endPoint.allMessages +
      `?userId=${params?.userId}&receiverId=${params?.receiverId}&page=${page}`
  );

  /* 
   const [messagesCache]: any = useSQList(
    messages?.messages,
    getMessages,
    `messages${params?.receiverId}`,
    isFirstRender
  );
  */

  const usersFromRedux: any = useSelector(
    (state: RootType) => state.usersSlice.users
  );

  /* handle go back */
  const handleGoBack = () => {
    setIsFirstRender(false);
    setIsFirstGetMessages(false);
    setReceiverImage(null);
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
    isFirstRender && getMessages();
  }, [page, isFirstRender]);

  const handleLoadMore = () => {
    let usersLength = messages?.messages?.length;
    let total = messages?.total;
    if (total && usersLength < total) {
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
      getMessages();
      dispatch(setIsUsersRefresh(true));
      setIsMessageReceived(false);
    }
  }, [isMessageReceived]);

  const handleShowCall = (type: string) => {
    if (!isCallStart) {
      setIsCallStart(true);
      type == "audio" && setIsAudioCall(true);
      type == "video" && setIsVideoCall(true);
    }
  };

  // Socket Code
  useEffect(() => {
    const socket = io("https://chatappapi-2w5v.onrender.com");
    socketRef.current = socket;

    const handleReceiveMessage = (messageReceiverID: string) => {
      if (myData?._id == messageReceiverID) {
        setIsMessageReceived(true);
      }
    };

    const handleReceiveCall = (data: any) => {
      if (myData?._id == data.userToCall) {
        setIsReceiveCall(true);
        setIsVideoCall(data.video);
        setIsAudioCall(data.voice);
        setCaller(data.from);
        setCallerSignal(data.signal);
        setName(data.name);
      }
    };

    /*   navigator?.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      }); */

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("callUser", handleReceiveCall);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.disconnect();
    };
  }, []);

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
    if (success && !isFirstGetMessages) {
      dispatch(setIsUsersRefresh(true));
      flatListRef.current?.scrollToEnd({ animated: true });
      setIsFirstGetMessages(true); // Ensure it happens only on first fetch
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
    return (
      <View style={styles.container}>
        <GestureHandlerRootView>
          <FlatList
            ref={flatListRef}
            data={messages?.messages}
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
    );
  }
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
