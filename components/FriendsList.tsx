import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { primaryColor, secondaryColor } from "@/constants/colors"; // Assuming your colors are stored in a constants file

// Sample data for people
const people = [
  {
    id: "1",
    name: "John Doe",
    status: "Hey, I'm using WhatsApp",
    imageUri: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    status: "Available",
    imageUri: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "3",
    name: "Alice Johnson",
    status: "Busy",
    imageUri: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  // Add more people here
];

const FriendsList = () => {
  // Render item for FlatList
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={{ uri: item.imageUri }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={people}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.flatList}
    />
  );
};

// Styles for the component
const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: "#f1f1f1", // Light background
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
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
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: primaryColor,
  },
  status: {
    fontSize: 14,
    color: secondaryColor,
  },
});

export default FriendsList;
