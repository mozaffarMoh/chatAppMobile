import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "emoji-mart-native";
import { endPoint } from "@/api/endPoint";
import { usePost } from "@/custom-hooks";
import { ActivityIndicator } from "react-native-paper";
import { Audio } from "expo-av";
import { playSendMessageSound } from "@/constants/soundsFiles";
import RecordingAudio from "./RecordingAudio";

export const ChatInputFooter = ({
  direction,
  t,
  userId,
  receiverId,
  setReadyToGetMessages,
  socketRef,
}: any) => {
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [openRecordingModal, setOpenRecordingModal] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("00:30");
  const inputRef: any = useRef(null);
  const isRTL = direction == "rtl";
  const reverseDirection = isRTL ? "ltr" : "rtl";
  const body = message?.startsWith("data:audio/webm;base64")
    ? { message, isAudio: true, duration }
    : { message };
  const [sendMessagePost, loadingSendMessage, successMessageSent] = usePost(
    `${endPoint.sendMessage}?userId=${userId}&receiverId=${receiverId}`,
    body
  );

  const handleSendMessage = () => {
    if (message) {
      playSendMessageSound();
      setMessage("");
      socketRef.current.emit("sendMessage", receiverId);
      sendMessagePost();
    }
  };

  const handleEmojiPress = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const handleEmojiSelected = (emoji: any) => {
    console.log("emojie : ", emoji?.native);
    setMessage((currentText) => currentText + emoji?.native);

    // const currentText = inputRef?.current.state.text;
    // inputRef?.current.setState({ text: currentText + emoji });
  };

  const handleTypeMessage = (text: string) => {
    setMessage(text);
  };

  useEffect(() => {
    if (successMessageSent) {
      setReadyToGetMessages(true);
    }
  }, [successMessageSent]);

  if (message) {
    console.log(message?.slice(0, 100));
  }

  return (
    <View style={[styles.footerContainer, { direction: reverseDirection }]}>
      {loadingSendMessage ? (
        <ActivityIndicator size={25} color={primaryColor} />
      ) : (
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons
            name={!message ? "send-outline" : "send"}
            size={25}
            style={{ transform: isRTL ? "rotate(180deg)" : "rotate(0deg)" }}
            color={!message ? thirdColor + "77" : thirdColor}
          />
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
      <TouchableOpacity
        style={{ marginLeft: !isRTL ? 7 : 0, marginRight: isRTL ? 7 : 0 }}
        onPress={() => setOpenRecordingModal(true)}
      >
        <Ionicons name="mic" size={25} color={thirdColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleEmojiPress}>
        <Ionicons name="happy-outline" size={25} color={thirdColor} />
      </TouchableOpacity>

      {isEmojiPickerVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEmojiPickerVisible}
          onRequestClose={() => setIsEmojiPickerVisible(false)}
        >
          <View style={styles.emojiPickerModal}>
            <Picker onSelect={handleEmojiSelected} />
            <Ionicons
              onPress={() => setIsEmojiPickerVisible(false)}
              name="close-circle"
              size={50}
              color="#fd9"
            />
          </View>
        </Modal>
      )}

      <RecordingAudio
        isVisible={openRecordingModal}
        handleCloseModal={() => setOpenRecordingModal(false)}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        setDuration={setDuration}
        isRTL={isRTL}
      />
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
  emojiPickerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
