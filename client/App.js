import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigation from "./routes/index";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import { useFonts } from "expo-font";
import { useCallback, useState, useMemo } from "react";
import MainContainer from "./components/MainContainer";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";  
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const AppContext = useMemo(() => {
    return {
      isDarkTheme,
      setIsDarkTheme,
    };
  });
  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Montserrat-Regular.ttf"),
    bold: require("./assets/fonts/Montserrat-Bold.ttf"),
    italic: require("./assets/fonts/Montserrat-Italic.ttf"),
    boldItalic: require("./assets/fonts/Montserrat-BoldItalic.ttf"),
    light: require("./assets/fonts/Montserrat-Light.ttf"),
    lightItalic: require("./assets/fonts/Montserrat-LightItalic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainContainer />
      </PersistGate>
    </Provider>
  );
}
