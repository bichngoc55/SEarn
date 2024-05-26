import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ReuseBtn from "../../components/buttonComponent";
import { COLOR } from "../../constant/color";
import scale from "../../constant/responsive";

const SignUpOrLoginPage = () => {
  const navigation = useNavigation();

  const handleRegisterPress = () => {
    navigation.navigate("Register");
  };

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };
  return (
    <View style={styles.main}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("GettingStarted")}
        >
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Image
          source={require("../../assets/images/logoSEE.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.musicifyText}>Musicify</Text>
        <Text style={styles.descriptionText}>
          Musicify is the go-to Vietnamese music app, offering a wide range of
          tracks, personalized playlists.
        </Text>
        <View style={styles.buttonsContainer}>
          <View>
            <ReuseBtn
              onPress={handleRegisterPress}
              btnText="Register"
              textColor="#ffffff"
              width={scale(150)}
              height={scale(65)}
            />
          </View>
          <View style={styles.wrapContainer}>
            <ReuseBtn
              onPress={handleLoginPress}
              btnText="Sign up"
              textColor="#ffffff"
              width={scale(150)}
              height={scale(65)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#121212",
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(160),
  },
  logo: {
    width: scale(160),
    height: scale(150),
  },
  musicifyText: {
    fontFamily: "Montserrat",
    fontSize: scale(25),
    color: COLOR.textPrimaryColor,
    marginBottom: 17,
  },
  descriptionText: {
    fontSize: scale(14),
    marginHorizontal: scale(15),
    fontFamily: "Montserrat",
    marginBottom: scale(20),
    color: COLOR.textPrimaryColor,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapContainer: {
    paddingLeft: scale(20),
  },
});

export default SignUpOrLoginPage;
