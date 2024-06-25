import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import ReuseBtn from "../../components/buttonComponent";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "../../components/textField";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import { COLOR } from "../../constant/color";
import scale from "../../constant/responsive";
import { fetchSpotifyAccessToken } from "../../redux/spotifyAccessTokenSlice";

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export default function ForgorPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const resetPasswordError = useSelector((state) => state.user.error);
  const { accessTokenForSpotify } = useSelector((state) => state.spotifyAccessToken);
  const { accessToken } = useSelector((state) => state.user);
  const handleSubmit = async (values) => {
    try {
      const response = await fetch("http://10.0.2.2:3005/auth/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await response.json();
      console.log(data, "userRegister");
      alert("Your password is send to your email");
      values.email=""
    } catch (error) {
      console.error("reset password error:", error);
    }
  };

  const forgotPassword = async (e) => {
    e.preventDefault();
    console.log(emailInput);
    fetch("http://10.0.2.2:3005/auth/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        alert(data.status);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <Pressable
          style={styles.backButton}
          onPress={navigation.goBack}
        >
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </Pressable>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Image
            source={require("../../assets/images/logoSEarn.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.loginText}>Reset Password</Text>

          <Formik
            initialValues={{ email: ""}}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <TextField
                    width={scale(310)}
                    height={scale(65)}
                    placeholder="Enter your email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorMessage}>{errors.email}</Text>
                  )}
                </View>
                {resetPasswordError && (
                  <Text style={styles.errorMessage}>
                    {loginError === "User does not exist."
                      ? "User does not exist"
                      : loginError === "Invalid credentials."
                      ? "Invalid email"
                      : loginError}
                  </Text>
                )}
                <View style={styles.btnContainer}>
                  <ReuseBtn
                    onPress={handleSubmit}
                    btnText="Reset password"
                    textSize={scale(18)}
                    textColor="#ffffff"
                    width={scale(210)}
                    height={scale(65)}
                  />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#121212",
  },
  backButtonContainer: {
    marginTop: scale(27),
    marginLeft: scale(15),
  },
  backButton: {
    width: scale(30),
    height: scale(30),
    borderRadius:scale(100),
    backgroundColor: "rgba(211, 211, 211, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(2)
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop:scale(30),
    paddingHorizontal: scale(24),
  },
  logo: {
    marginVertical: scale(20),
    width: scale(208),
    height: scale(150),
  },
  loginText: {
    fontSize: 30,
    color: COLOR.textPrimaryColor,
    marginBottom: 10,
    fontFamily:"semiBold"
  },
  errorMessage: {
    color: "red",
  },
  registerButton: {
    color: COLOR.textPrimaryColor,
  },
  signInLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(20),
  },
  signInText: {
    color: COLOR.textPrimaryColor,
  },
  signInLink: {
    color: COLOR.textLinkColor,
  },
  btnContainer: {
    marginTop: scale(20),
    alignItems: "center",
  },
});
  