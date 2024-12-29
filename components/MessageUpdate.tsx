import { endPoint } from "@/api/endPoint";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { useDelete, usePut } from "@/custom-hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmojiModal from "./EmojiModal";

const MessageUpdate = ({
  t,
  isVisible,
  handleCloseModal,
  messageToUpdate,
  setMessageToUpdate,
  message,
  setReadyToGetMessages,
}: any) => {
  const [updatedMessage, setUpdatedMessage] = useState<string>("");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [handleDelete, loadingDelete, errorDelete, successDelete] = useDelete(
    endPoint.deleteMessage + messageToUpdate?._id
  );

  const [handleEdit, loadingEdit, successEdit, errorEdit] = usePut(
    endPoint.editMessage + messageToUpdate?._id,
    { message: updatedMessage }
  );

  useEffect(() => {
    setUpdatedMessage(messageToUpdate?.message);
  }, [messageToUpdate]);

  useEffect(() => {
    if (successDelete || successEdit) {
      setReadyToGetMessages(true);
      handleClose();
    }
  }, [successDelete, successEdit]);

  const handleClose = () => {
    setMessageToUpdate({ _id: "", message: "" });
    handleCloseModal();
  };

  const handleEmojiPress = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const handleEmojiSelected = (emoji: any) => {
    setUpdatedMessage((currentText) => currentText + emoji?.native);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Ionicons
            name="close-circle-outline"
            size={35}
            style={styles.closeIcon}
            onPress={handleClose}
          />

          <View style={styles.buttons}>
            <Pressable
              style={[styles.updateButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              {loadingDelete ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.modalButtonText}>
                  {t("buttons.deleteMessage")}
                </Text>
              )}
            </Pressable>
            {messageToUpdate?.message && (
              <Pressable
                style={[styles.updateButton, styles.editButton]}
                onPress={handleEdit}
              >
                {loadingEdit ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {t("buttons.editMessage")}
                  </Text>
                )}
              </Pressable>
            )}
          </View>
          {messageToUpdate?.message && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Update your message"
                placeholderTextColor={"#ccc"}
                multiline
                value={updatedMessage}
                onChangeText={(text: string) => setUpdatedMessage(text)}
              />
              <TouchableOpacity
                onPress={handleEmojiPress}
                style={styles.emojiIcon}
              >
                <Ionicons
                  name={isEmojiPickerVisible ? "happy" : "happy-outline"}
                  size={30}
                  color={"#ddd"}
                />
              </TouchableOpacity>
            </View>
          )}

          <EmojiModal
            isVisible={isEmojiPickerVisible}
            handleCloseModal={() => setIsEmojiPickerVisible(false)}
            onSelect={handleEmojiSelected}
            isUpdateMessage={true}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: primaryColor,
    padding: 20,
    borderRadius: 10,
    gap: 20,
    alignItems: "center",
  },
  buttons: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  closeIcon: {
    alignSelf: "flex-end",
  },
  updateButton: {
    width: 200,
    height: 40,
    padding: 5,
    justifyContent: "center",
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#f33",
  },
  editButton: {
    backgroundColor: secondaryColor,
  },
  modalButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#eee",
    paddingRight:30
  },
  emojiIcon: {
    position: "absolute",
    right: 5,
  },
});

export default MessageUpdate;
