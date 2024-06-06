import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ReuseBtn from "../../components/buttonComponent";
import { COLOR } from "../../constant/color";
import scale from "../../constant/responsive";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const GettingStartedScreen = () => {
  const navigation = useNavigation();
  const handleClick = () => {
    navigation.navigate("SignUpOrLogin");
  };
  const fullText = "Your ultimate music experience";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer;

    if (index <= fullText.length) {
      timer = setTimeout(() => {
        setDisplayedText(fullText.substring(0, index));
        setIndex(index + 1);
      }, 150);
    } else {
      timer = setTimeout(() => {
        setDisplayedText("");
        setIndex(0);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [index]);
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/_ (1).gif")}
        style={styles.gifBackground}
        resizeMode="cover"
      />

      <View style={styles.contentContainer}>
        <Text style={styles.enjoyText}>Enjoy Listening to Music</Text>

        <Text style={styles.searnText}>SEarn</Text>

        <Text style={styles.typingText}>{displayedText}</Text>

        <View style={styles.buttonContainer}>
          <ReuseBtn
            onPress={handleClick}
            btnText="Getting Started"
            textSize={scale(18)}
            textColor="#ffffff"
            width={scale(210)}
            height={scale(65)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gifBackground: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    zIndex: -1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: scale(270),
    paddingHorizontal: scale(29),
  },
  enjoyText: {
    fontSize: scale(25),
    fontFamily: "regular",
    textAlign: "center",
    color: COLOR.textPrimaryColor,
    marginBottom: scale(20),
  },
  backButtonContainer: {
    marginTop: scale(20),
    marginLeft: scale(15),
  },
  backButton: {
    width: scale(35),
    height: scale(35),
    borderRadius: 17.5,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(10),
  },
  searnText: {
    fontFamily: "regular",
    fontSize: 23,
    textAlign: "center",
    marginBottom: scale(20),
    color: COLOR.textPrimaryColor,
  },
  typingText: {
    fontSize: scale(15),
    marginBottom: scale(30),
    fontFamily: "regular",
    color: COLOR.textPrimaryColor,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
  },
});

export default GettingStartedScreen;
