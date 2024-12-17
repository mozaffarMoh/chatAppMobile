import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import useRTL from "@/custom-hooks/useRTL";
import { TextInput } from "react-native-paper";
import { useGet, usePost } from "@/custom-hooks";
import { endPoint } from "@/api/endPoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import { UsersItem } from "@/components/UsersItem";
import { Ionicons } from "@expo/vector-icons";
import { primaryColor } from "@/constants/colors";

const Main = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t }: any = useRTL();
  const [myData, setMyData]: any = useState(null);
  const [userId, setUserId]: any = useState("");
  const [page, setPage]: any = useState(1);

  const navigation = useNavigation();
  const [users, loading, getUsers, success] = useGet(
    endPoint.allUsers + userId + "?page=" + page
  );
  const [
    handleSearchPost,
    filteredUsersLoading,
    ,
    ,
    filteredUsers,
    ,
    setFilteredUsersData,
  ]: any = usePost(endPoint.searchUsers, { name: searchQuery });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: t("header.main"),
    });
  }, [navigation, t]);

  /* get user id from storage */
  useEffect(() => {
    getItemFromStorage("userId", setUserId);
    getItemFromStorage("myData", setMyData);
  }, []);

  /* get all users */
  useEffect(() => {
    if (userId) getUsers();
  }, [userId, page]);

  /* store myData in storage if exist */
  useEffect(() => {
    if (users?.users && !myData) {
      users?.users?.forEach((item: any) => {
        if (item._id == userId) {
          AsyncStorage.setItem("myData", JSON.stringify(item));
          setMyData(item);
        }
      });
    }
  }, [users, myData, userId]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Memoize the header to prevent unnecessary re-renders
  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search here..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
        {filteredUsersLoading ? (
          <ActivityIndicator
            color={primaryColor}
            size={20}
            style={{ position: "absolute", bottom: "50%", right: 25 }}
          />
        ) : (
          <Ionicons
            onPress={
              searchQuery ? handleSearchPost : setFilteredUsersData(null)
            }
            name="search-circle"
            size={35}
            color={primaryColor}
            style={{ position: "absolute", bottom: "30%", right: 15 }}
          />
        )}
      </View>
    ),
    [searchQuery, filteredUsersLoading] // Only re-create the header when `searchQuery` changes
  );

  const ListFooterComponent = () => {
    return loading ? (
      <ActivityIndicator
        size="small"
        color="#fff"
        style={{ marginVertical: 10 }}
      />
    ) : (
      <></>
    );
  };

  const handleLoadMore = () => {
    let usersLength = users?.users?.length;
    let total = users?.total;
    if (total && usersLength < total) {
      setPage((prev: number) => prev + 1);
    }
  };

  let currentArray = filteredUsers?.users || users?.users || [];
  return (
    <FlatList
      data={currentArray}
      renderItem={UsersItem}
      keyExtractor={(item: any) => item._id}
      style={styles.flatList}
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={handleLoadMore}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

// Styles for the component
const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: "black", // Light background
  },
  searchContainer: {
    padding: 10,
    marginHorizontal: 10,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    height: 40,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
});

export default Main;
