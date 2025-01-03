import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  I18nManager,
} from "react-native";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { endPoint } from "@/api/endPoint";
import { useGet } from "@/custom-hooks";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCustomTheme from "@/custom-hooks/useCustomTheme";

export default function DrawerContent() {
  const { defaultBG, defaultTitle } = useCustomTheme();
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();
  const isRTL = i18n.language === "ar";

  const [, logoutLoading, handleLogout, , errorMessageLogout] = useGet(
    endPoint.logout
  );

  const navigationItems = [
    { name: t("header.main"), route: "/" },
    { name: t("header.myAccount"), route: "/(screens)/MyAccount" },
    { name: t("header.lang"), isLang: true },
    { name: t("header.logout") },
  ];

  const handleLogoutAlert = () => {
    Alert.alert(
      t("header.logout"), // Alert title
      t("alerts.confirmLogout"), // Alert message
      [
        { text: t("alerts.cancel"), style: "cancel" },
        {
          text: t("alerts.confirm"),
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("activeTheme");
            handleLogout(); // Add actual logout logic here
          },
        },
      ]
    );
  };

  const handelChangeLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem("language", lang);
      i18n.changeLanguage(lang);
      navigation.dispatch(DrawerActions.closeDrawer());

      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);

      /*    if (I18nManager.isRTL) {
        await Updates.reloadAsync();
      } */
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  /* Navigation  */
  const handleNavigate = (path: any, isLang: boolean) => {
    if (!path) {
      let lang = isRTL ? "en" : "ar";
      isLang ? handelChangeLanguage(lang) : handleLogoutAlert();
    } else {
      router.push(path);
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
            onPress={() => handleNavigate(item.route, item?.isLang)}
          >
            {!item?.route && !item?.isLang && logoutLoading ? (
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
