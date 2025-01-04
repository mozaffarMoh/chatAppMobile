import { getItemFromStorage } from "@/constants/getItemFromStorage";
import { setActiveTheme } from "@/Slices/activeTheme";
import { RootType } from "@/store";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const useCustomTheme = () => {
  const activeTheme = useSelector((state: RootType) => state.activeTheme.value);
  const [themeFromStorage, setThemeFromStorage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!themeFromStorage) {
      getItemFromStorage("activeTheme", setThemeFromStorage);
    }
  }, []);

  useEffect(() => {
    if (themeFromStorage && !activeTheme) {
      dispatch(setActiveTheme(themeFromStorage));
    }
  }, [themeFromStorage]);

  const isDark = useColorScheme() == (activeTheme || "dark");
  let defaultBG = isDark ? "#222" : "#eee";
  let defaultTitle = isDark ? "#eee" : "#222";
  return { defaultTitle, defaultBG, isDark };
};

export default useCustomTheme;
