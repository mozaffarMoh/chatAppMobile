import { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

const CustomSnackbar = ({ visible, onDismiss }: any) => {
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
  }, [visible, onDismiss]);
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      action={{
        icon: "close",
        label: "Close",
        onPress: onDismiss,
      }}
      style={{
        bottom: screenHeight - 200, // Adjust vertical position
        backgroundColor: "#6200ee",
      }}
    >
      Hey there! I'm a Snackbar.
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
