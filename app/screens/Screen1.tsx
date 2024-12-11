import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Screen1 = () => {
  const { userId, name } = useLocalSearchParams();
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: t("screen1"),
      headerRight:() => <Button title='back' onPress={() => navigation.goBack()} /> 
    });
  }, [navigation,t]);

  return (
    <SafeAreaView>
      <Text>Screen1 Content</Text>
      <Text>name : {name}</Text>
      <Text>id : {userId}</Text>
    </SafeAreaView>
  );
};

export default Screen1;
