import { useColorScheme } from "react-native";

export const useColor = (type: string) => {
  const colorScheme = useColorScheme();
  if (type == "normal") {
    return colorScheme == "dark" ? "white" : "black";
  } else {
    return "black";
  }
};
