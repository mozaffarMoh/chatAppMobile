import { Ionicons } from "@expo/vector-icons";
import { Picker } from "emoji-mart-native";
import { Modal, StyleSheet, View } from "react-native";

const EmojiModal = ({
  isVisible,
  handleCloseModal,
  onSelect,
  isUpdateMessage,
}: any) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCloseModal}
    >
      <View
        style={[
          styles.emojiPickerModal,
          { justifyContent: isUpdateMessage ? "flex-start" : "center" },
        ]}
      >
        <Picker set="apple" native={true} onSelect={onSelect} />
        <Ionicons
          onPress={handleCloseModal}
          name="close-circle"
          size={50}
          color="#fd9"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  emojiPickerModal: {
    flex: 1,
    alignItems: "center",
  },
});

export default EmojiModal;
