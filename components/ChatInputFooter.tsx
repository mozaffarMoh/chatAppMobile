import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Picker from "emoji-mart-native";

export const ChatInputFooter = () => {
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const inputRef: any = useRef(null);

  const handleEmojiPress = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const handleEmojiSelected = (emoji: any) => {
    console.log("emojie : ", emoji);

    /*   const currentText = inputRef?.current.state.text;
    inputRef?.current.setState({ text: currentText + emoji });
  */
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={handleEmojiPress}>
        <Ionicons name="arrow-forward-circle" size={45} color={primaryColor} />
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        placeholder="Type your message..."
        multiline
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
    marginBottom: 10,
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
