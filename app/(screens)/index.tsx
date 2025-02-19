import React, {
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Redirect, router, useFocusEffect, useNavigation } from "expo-router";
import useRTL from "@/custom-hooks/useRTL";
import { TextInput } from "react-native-paper";
import { useGet, usePost } from "@/custom-hooks";
import { endPoint } from "@/api/endPoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getItemFromStorage } from "@/constants/getItemFromStorage";
import { UsersItem } from "@/components/UsersItem";
import { Ionicons } from "@expo/vector-icons";
import { primaryColor, secondaryColor } from "@/constants/colors";
import { useAuth } from "@/Context/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { RootType } from "@/store";
import { setIsUsersRefresh } from "@/Slices/refreshUsers";
import { setIsProfileUpdated } from "@/Slices/isProfileUpdated";
import { setIsReset } from "@/Slices/isReset";
import { setUsersSlice } from "@/Slices/usersSlice";
import useCustomTheme from "@/custom-hooks/useCustomTheme";
import { registerForPushNotificationsAsync } from "@/constants/notifications";
import baseApi from "@/api/baseApi";
import { usePushTokens } from "@/Context/pushTokensProvider";

const Main = () => {
  const { defaultTitle, defaultBG } = useCustomTheme();
  const dispatch = useDispatch();
  const { isAuth }: any = useAuth();
  const { pushTokens, setPushTokens }: any = usePushTokens();
  const [searchQuery, setSearchQuery] = useState("");
  const { t, isRTL }: any = useRTL();
  const [myData, setMyData]: any = useState(null);
  const [userId, setUserId]: any = useState("");
  const [page, setPage]: any = useState(1);
  const navigation = useNavigation();
  const isUserSeeMessages: any = useSelector(
    (state: RootType) => state.refreshUsers.value
  );
  const isProfileUpdated: any = useSelector(
    (state: RootType) => state.isProfileUpdated.value
  );
  const isReset: any = useSelector((state: RootType) => state.isReset.value);
  const [users, loading, getUsers, success, , setUsers] = useGet(
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
  useFocusEffect(
    useCallback(() => {
      if (!userId) getItemFromStorage("userId", setUserId);
      if (!myData) {
        getItemFromStorage("myData", setMyData);
      }
    }, [])
  );

  /* get all users */
  useEffect(() => {
    if (userId) getUsers();
  }, [userId, page]);

  useEffect(() => {
    if (isUserSeeMessages || isProfileUpdated) {
      dispatch(setIsUsersRefresh(false));
      dispatch(setIsProfileUpdated(false));
      getUsers();
    }
  }, [isUserSeeMessages, isProfileUpdated]);

  /* reset all states */
  useEffect(() => {
    if (isReset) {
      handleReset();
    }
  }, [isReset]);

  /* reset all states function */
  const handleReset = () => {
    dispatch(setIsReset(false));
    setSearchQuery("");
    setUserId("");
    setMyData(null);
    setPage(1);
    setUsers([]);
    setFilteredUsersData([]);
  };

  /* store myData in storage if exist */
  useEffect(() => {
    if (users?.users) {
      let usersForStoreInRedux: any = [];
      users?.users?.forEach((item: any) => {
        if (item._id == userId) {
          AsyncStorage.setItem("myData", JSON.stringify(item));
          setMyData(item);
        } else {
          usersForStoreInRedux.push(item);
        }
      });

      dispatch(setUsersSlice(usersForStoreInRedux));
    }

    if (userId && !pushTokens?.[userId]) {
      registerForPushNotificationsAsync()
        .then(async (token: any) => {
          await baseApi
            .post(endPoint.pushNotification, {
              receiverId: userId,
              pushToken: token,
            })
            .then((res: any) => {
              setPushTokens(res?.data?.data);
            })
            .catch((err: any) => {
              console.log("error in got tokens :", err);
            });
        })
        .catch((error: any) => console.error("Failed to get token", error));
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
          placeholder={t("placeholder.searchHere")}
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
          textColor={defaultTitle}
          style={[
            styles.searchInput,
            {
              textAlign: isRTL ? "right" : "left",
              paddingRight: isRTL ? 35 : 0,
              backgroundColor: defaultBG,
            },
          ]}
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
    [searchQuery, filteredUsersLoading, defaultBG, isRTL] // Only re-create the header when `searchQuery` changes
  );

  const ListFooterComponent = () => {
    return loading ? (
      <ActivityIndicator
        size="small"
        color={defaultTitle}
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
  if (isAuth === false) {
    return <Redirect href="/(screens)/Login" />;
  } else if (isAuth === null) {
    return <Redirect href="/(screens)/LoadingScreen" />;
  } else {
    return (
      <FlatList
        data={currentArray}
        renderItem={({ item }) => <UsersItem item={item} userId={userId} />}
        keyExtractor={(item: any) => item._id}
        style={[
          styles.flatList,
          {
            backgroundColor: defaultBG,
          },
        ]}
        ListHeaderComponent={ListHeaderComponent}
        onEndReached={handleLoadMore}
        ListFooterComponent={ListFooterComponent}
      />
    );
  }
};

// Styles for the component
const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchContainer: {
    padding: 10,
    marginHorizontal: 10,
  },
  searchInput: {
    borderRadius: 3,
    height: 40,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});

export default Main;
