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

  console.log(themeFromStorage, activeTheme);

  useEffect(() => {
    if (!themeFromStorage) {
      console.log("got from storage");
      getItemFromStorage("activeTheme", setThemeFromStorage);
    }
  }, []);

  useEffect(() => {
    if (themeFromStorage && !activeTheme) {
      console.log("set storage to redux");
      dispatch(setActiveTheme(themeFromStorage));
    }
  }, [themeFromStorage]);

  const isDark = useColorScheme() == (activeTheme || "dark");
  let defaultBG = isDark ? "#222" : "#eee";
  let defaultTitle = isDark ? "#eee" : "#222";
  return { defaultTitle, defaultBG, isDark };
};

export default useCustomTheme;
