import { primaryColor, secondaryColor } from "@/constants/colors";
import { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

const CustomSnackbar = ({
  visible = false,
  onDismiss = () => {},
  message,
  type,
}: any) => {
  const screenHeight = Dimensions.get("window").height;

  /* cancel snackbar after 3 seconds */
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (visible) {
      id = setTimeout(() => {
        onDismiss();
      }, 3000);
    }

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [visible]);

  const snackbarColor = () => {
    if (type == "success") {
      return "#6200ee";
    } else {
      return "#cc0000";
    }
  };
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      action={{
        label: "Close",
        onPress: onDismiss,
        textColor: "white",
      }}
      style={{
        bottom: 20, // Adjust vertical position
        backgroundColor: snackbarColor(),
      }}
    >
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default CustomSnackbar;
