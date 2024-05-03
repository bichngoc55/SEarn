import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLOR } from "../../constant/color";
import ReuseBtn from "../../components/buttonComponent";
//import { useNavigation } from "@react-navigation/native";
import scale from "../../constant/responsive";

const LaunchingPage = () => {
  const [isRegisterSelected, setIsRegisterSelected] = useState(true);
  //const navigation = useNavigation();
  const handleButtonPress = (buttonType) => {
    if (buttonType === "Register") {
      setIsRegisterSelected(true);
    } else {
      setIsRegisterSelected(false);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logoSEE.png")}
        style={styles.image}
      />
      <Text style={styles.text1}>Enjoy listening to music</Text>
      <Text style={styles.text2}>
        Spotify is a proprietary Swedish audio streaming and media services
        provider
      </Text>

      <View style={styles.stack}>
        <ReuseBtn
          btnText={"Register"}
          onPress={() => handleButtonPress("Register")}
          textColor={COLOR.textPrimaryColor}
          width={scale(140)}
          height={scale(55)}
          borderColor={COLOR.textPrimaryColor}
          isSelected={isRegisterSelected}
        />
        <ReuseBtn
          btnText={"Sign up"}
          onPress={() => handleButtonPress("Sign up")}
          textColor={COLOR.textPrimaryColor}
          width={scale(140)}
          height={scale(55)}
          borderColor={COLOR.textPrimaryColor}
          isSelected={!isRegisterSelected}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1B1B",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  text1: {
    fontSize: scale(26),
    fontFamily: "regular",
    position: "absolute",
    top: scale(300),
    fontWeight: "bold",
  },
  text2: {
    fontSize: scale(16),
    fontFamily: "light",
    position: "absolute",
    top: scale(350),
    textAlign: "center",
  },
  image: {
    width: "70%",
    position: "absolute",
    top: scale(100),
    height: scale(200),
    resizeMode: "contain",
  },
  stack: {
    position: "absolute",
    flex: 1,
    top: scale(420),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default LaunchingPage;
