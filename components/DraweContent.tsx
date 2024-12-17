import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { endPoint } from "@/api/endPoint";
import { useGet } from "@/custom-hooks";
import { ActivityIndicator } from "react-native-paper";

export default function DrawerContent() {
  const { t } = useTranslation();
  const [, logoutLoading, handleLogout, , errorMessageLogout] = useGet(
    endPoint.logout
  );

  const navigationItems = [
    { name: t("header.main"), route: "/" },
    { name: t("header.myAccount"), route: "/(screens)/MyAccount" },
    { name: t("auth.login"), route: "/(screens)/Login" },
    { name: t("auth.signUp"), route: "/(screens)/Register" },
    { name: t("header.logout") },
  ];

  const handleNavigate = (path: any) => {
    if (!path) {
      Alert.alert(
        t("header.logout"), // Alert title
        t("alerts.confirmLogout"), // Alert message
        [
          { text: t("alerts.cancel"), style: "cancel" },
          {
            text: t("alerts.confirm"),
            style: "destructive",
            onPress: () => {
              handleLogout(); // Add actual logout logic here
            },
          },
        ]
      );
    } else {
      router.replace(path);
    }
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/favicon.png")} // Adjust the path
          style={styles.image}
          resizeMode="contain"
        />
        {navigationItems.map((item: any, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => handleNavigate(item.route)}
          >
            {!item?.route && logoutLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.navText}>{item.name}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 50,
  },
  navItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  navText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
