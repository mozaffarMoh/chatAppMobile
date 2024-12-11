import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  I18nManager,
  Alert,
  ScrollView,
} from "react-native";
import {
  Avatar,
  Button as ButtonP,
  Card,
  Surface,
  Text,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import * as Updates from "expo-updates";
import {
  Directions,
  State,
  FlingGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFontForLanguage } from "@/constants/font";
import { SafeAreaView } from "react-native-safe-area-context";

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />;

const About = () => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language == "ar";
  const [gesVal, setGesVal] = useState(false);
  const fontFamily = getFontForLanguage(i18n.language);

  const onSwipe = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log("Swiped Left!");
      setGesVal(!gesVal);
    }
  };

  return (
    <GestureHandlerRootView
      style={{ flex: 1, direction: isRTL ? "rtl" : "ltr" }}
    >
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text variant="titleLarge" style={{ color: "red", fontWeight: "bold" }}>
          {t("about_title")}
        </Text>

        <FlingGestureHandler
          direction={Directions.LEFT} // Use Directions constants
          onHandlerStateChange={onSwipe}
        >
          <View style={styles.container}>
            <Text style={gesVal ? styles.text : styles.gesTest}>
              Swipe Left
            </Text>
          </View>
        </FlingGestureHandler>

        <View style={{ flexDirection: "row", gap: 2 }}>
          <Button title={t("first")} />
          <Button title={t("second")} />
        </View>
        <Card style={styles.card}>
          <Card.Title
            title={t("card_title")}
            subtitle={t("card_subtitle")}
            left={LeftContent}
            titleStyle={{
              fontFamily, // Custom font for title
            }}
            subtitleStyle={{
              fontFamily, // Custom font for subtitle
            }}
          />

          <Card.Content>
            <Text variant="titleLarge" style={{ fontFamily }}>
              {t("card_content_title")}
            </Text>
            <Text variant="bodyMedium" style={{ fontFamily }}>
              {t("card_content_body")}
            </Text>
          </Card.Content>
          <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
          <Card.Actions>
            <ButtonP>{t("cancel")}</ButtonP>
            <ButtonP>{t("ok")}</ButtonP>
          </Card.Actions>
        </Card>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    color: "green",
  },
  gesTest: {
    fontSize: 44,
    color: "red",
  },
  app: {
    flex: 1,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "80%",
    fontFamily: "Bahij",
  },
});

export default About;
