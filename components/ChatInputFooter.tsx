import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Picker from "emoji-mart-native";
import { endPoint } from "@/api/endPoint";
import { usePost } from "@/custom-hooks";
import { ActivityIndicator } from "react-native-paper";

export const ChatInputFooter = ({
  direction,
  t,
  userId,
  receiverId,
  setReadyToGetMessages,
  socketRef,
}: any) => {
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef: any = useRef(null);
  const reverseDirection = direction == "rtl" ? "ltr" : "rtl";
  const sendIcon =
    direction == "rtl" ? "arrow-back-circle" : "arrow-forward-circle";
  const [sendMessagePost, loadingSendMessage, successMessageSent] = usePost(
    `${endPoint.sendMessage}?userId=${userId}&receiverId=${receiverId}`,
    { message }
  );

  const handleSendMessage = () => {
    if (message) {
      setMessage("");
      socketRef.current.emit("sendMessage", receiverId);
      sendMessagePost();
    }
  };

  const handleEmojiPress = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const handleEmojiSelected = (emoji: any) => {
    console.log("emojie : ", emoji);

    /*   const currentText = inputRef?.current.state.text;
    inputRef?.current.setState({ text: currentText + emoji });
  */
  };

  const handleTypeMessage = (text: string) => {
    setMessage(text);
  };

  useEffect(() => {
    if (successMessageSent && message) {
      setReadyToGetMessages(true);
      setMessage("");
    }
  }, [successMessageSent]);

  return (
    <View style={[styles.footerContainer, { direction: reverseDirection }]}>
      {loadingSendMessage ? (
        <ActivityIndicator size={25} color={primaryColor} />
      ) : (
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name={sendIcon} size={45} color={!message ? primaryColor+'77' : primaryColor} />
        </TouchableOpacity>
      )}
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        placeholder={t("placeholder.chatInputPlaceholder")}
        multiline
        value={message}
        onChangeText={handleTypeMessage}
      />
      <TouchableOpacity onPress={handleEmojiPress}>
        <Ionicons name="happy-outline" size={30} color={thirdColor} />
      </TouchableOpacity>
      {isEmojiPickerVisible && (
        <View style={styles.emojiPicker}>
          {/*  <Picker onSelect={handleEmojiSelected} /> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
  },
  emojiPicker: {
    position: "fixed",
    zIndex: 100,
    top: 0,
    left: 20,
  },
});
