import { GestureHandlerRootView } from "react-native-gesture-handler";
import NavigationContainer from "./routes/index";
import { View, Text } from "react-native";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import MainContainer from "./components/MainContainer";

export default function App() {
  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Montserrat-Regular.ttf"),
    bold: require("./assets/fonts/Montserrat-Bold.ttf"),
    italic: require("./assets/fonts/Montserrat-Italic.ttf"),
    boldItalic: require("./assets/fonts/Montserrat-BoldItalic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }
  return <MainContainer></MainContainer>;
}
