import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "@/i18n";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import Drawer from "expo-router/drawer";
import DrawerContent from "@/components/DraweContent";
import LanguageToggle from "@/components/LanguageToggle";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Bahij: require("../assets/fonts/Bahij.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="test.db">
        <StatusBar style="auto" />
        <Drawer
          screenOptions={{
            headerShown: false,
            headerRight: () => <LanguageToggle />,
          }}
          drawerContent={() => <DrawerContent />}
        />
      </SQLiteProvider>
    </ThemeProvider>
  );
}
