import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigation from "./routes/index";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import { useFonts } from "expo-font";
import { useCallback, useState, useMemo ,useRef} from "react";
import MainNavigation from "./components/MainContainer";
import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const bannerRef = useRef(null);
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  })
  const AppContext = useMemo(() => {
    return {
      isDarkTheme,
      setIsDarkTheme,
    };
  });
  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Montserrat-Regular.ttf"),
    semiBold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
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
    <View style={styles.co}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />

          <MainNavigation />
        </PersistGate>
      </Provider>
    </View>
  );
}
const styles = StyleSheet.create({
  co: {
    flex: 1,
    backgroundColor: "#1b1b1b",
  },
});
