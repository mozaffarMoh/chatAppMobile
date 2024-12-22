import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
//import EmojiSelector from "react-native-emoji-selector";

export const ChatInputFooter = () => {
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const inputRef: any = useRef(null);

  const handleEmojiPress = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const handleEmojiSelected = (emoji: any) => {
    const currentText = inputRef.current.state.text;
    inputRef.current.setState({ text: currentText + emoji });
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={handleEmojiPress}>
        <Ionicons name="arrow-forward-circle" size={30} color={primaryColor} />
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        placeholder="Type your message..."
        multiline
      />
      <TouchableOpacity onPress={handleEmojiPress}>
        <Ionicons name="happy-outline" size={24} color={thirdColor} />
      </TouchableOpacity>
      {/*     {isEmojiPickerVisible && (
      <EmojiSelector 
        onEmojiSelected={handleEmojiSelected}
        style={styles.emojiPicker}
      />
    )} */}
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
