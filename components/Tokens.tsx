import { Ionicons } from "@expo/vector-icons";
import { Picker } from "emoji-mart-native";
import { Modal, StyleSheet, Text, View } from "react-native";

const TokensModal = ({ isVisible, handleCloseModal, tokens }: any) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={[styles.emojiPickerModal]}>
        {Object.entries(tokens).map(([key, value]: any, index) => (
          <Text key={index} style={{ color: "white", textAlign: "center" }}>
            {key} {value}
          </Text>
        ))}
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
    backgroundColor: "#00000077",
  },
});

export default TokensModal;
