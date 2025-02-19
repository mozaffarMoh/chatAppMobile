import { primaryColor, secondaryColor } from "@/constants/colors";
import useCustomTheme from "@/custom-hooks/useCustomTheme";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const UsersItem = ({ item, userId }: any) => {
  const { defaultTitle, defaultBG,isDark } = useCustomTheme();
  let imageURL = item.profilePhoto
    ? { uri: item.profilePhoto }
    : require("@/assets/images/avatar.png");

  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: isDark ? '#000': '#ddd' }]}
      onPress={() =>
        router.push({
          pathname: "/(screens)/SingleChat",
          params: {
            username: item?.username,
            userId,
            receiverId: item?._id,
          },
        })
      }
    >
      {item && item?.unReadMessages && item?.unReadMessages[userId] && (
        <View style={styles.notify}>
          <Text style={styles.textNotify}>
            {item?.unReadMessages?.[userId] || 5}
          </Text>
        </View>
      )}

      <Image source={imageURL} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{item?.username}</Text>
        <Text style={styles.email}>{item?.email}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: primaryColor,
  },
  email: {
    fontSize: 14,
    color: secondaryColor,
  },
  notify: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: secondaryColor,
    position: "absolute",
    top: 3,
    left: 5,
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textNotify: {
    textAlign: "center",
    color: "yellow",
    fontWeight: 800,
  },
});
