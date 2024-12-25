import { endPoint } from "@/api/endPoint";
import { primaryColor, secondaryColor, thirdColor } from "@/constants/colors";
import { useDelete, usePut } from "@/custom-hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const MessageUpdate = ({
  t,
  isVisible,
  handleCloseModal,
  messageToUpdate,
  setMessageToUpdate,
  message,
  setReadyToGetMessages,
}: any) => {
  const [updatedMessage, setUpdatedMessage] = React.useState<string>("");

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
            size={25}
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
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={t("placeholder.updateMessage")}
            placeholderTextColor={"#aaa"}
            multiline
            value={updatedMessage}
            onChangeText={(text: string) => setUpdatedMessage(text)}
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
  textInput: {
    backgroundColor: '#ddd',
    color: thirdColor,
    fontWeight:600,
    width: 200,
    borderRadius: 5,
    padding: 20,
  },
});

export default MessageUpdate;
