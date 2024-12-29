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
import EmojiModal from "./EmojiModal";

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
  const [duration, setDuration] = useState(0);
  const inputRef: any = useRef(null);
  const isRTL = direction == "rtl";
  const reverseDirection = isRTL ? "ltr" : "rtl";
  const isAudio = message?.startsWith("data:audio/webm;base64");
  const body = isAudio ? { message, isAudio: true, duration } : { message };
  const [sendMessagePost, loadingSendMessage, successMessageSent] = usePost(
    `${endPoint.sendMessage}?userId=${userId}&receiverId=${receiverId}`,
    body
  );

  const handleSendMessage = () => {
    if (message) {
      playSendMessageSound();
      socketRef.current.emit("sendMessage", receiverId);
      sendMessagePost();
      setMessage("");
      setDuration(0);
    }
  };

  const handleEmojiPress = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const handleEmojiSelected = (emoji: any) => {
    setMessage((currentText) => currentText + emoji?.native);
  };

  const handleTypeMessage = (text: string) => {
    setMessage(text);
  };

  useEffect(() => {
    if (successMessageSent) {
      setReadyToGetMessages(true);
    }
  }, [successMessageSent]);

  return (
    <View style={[styles.footerContainer, { direction: reverseDirection }]}>
      {loadingSendMessage ? (
        <ActivityIndicator size={25} color={thirdColor} />
      ) : (
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons
            name={!message ? "send-outline" : "send"}
            size={30}
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
        value={isAudio ? "" : message}
        onChangeText={handleTypeMessage}
      />
      <TouchableOpacity
        style={{ marginLeft: !isRTL ? 7 : 0, marginRight: isRTL ? 7 : 0 }}
        onPress={() => setOpenRecordingModal(true)}
      >
        <Ionicons name="mic" size={30} color={thirdColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleEmojiPress}>
        <Ionicons
          name={isEmojiPickerVisible ? "happy" : "happy-outline"}
          size={30}
          color={thirdColor}
        />
      </TouchableOpacity>

      <EmojiModal
        isVisible={isEmojiPickerVisible}
        handleCloseModal={() => setIsEmojiPickerVisible(false)}
        onSelect={handleEmojiSelected}
      />

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
