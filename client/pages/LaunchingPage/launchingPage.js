import React, { useEffect, useRef } from "react";
import { View, Image, Text, StyleSheet, Animated } from "react-native";
import scale from "../../constant/responsive";

const LaunchingPage = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fadeOut = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace("GettingStarted");
      });
    };

    const timer = setTimeout(fadeOut, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={require("../../assets/images/logoSEarn.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text>SEarn</Text>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  logo: {
    width: scale(160),
    height: scale(150),
  },
  text: {
    color: "#fff",
    fontSize: "10%",
    fontFamily: "bold",
    textAlign: "center",
  },
});

export default LaunchingPage;
