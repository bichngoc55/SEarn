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
  password: Yup.string()
    .min(8, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.user.error);
  const { accessToken } = useSelector((state) => state.user);
  const handleSubmit = async (values) => {
    try {
      // console.log(values);
      await dispatch(loginUser(values));
      await dispatch(fetchSpotifyAccessToken());

      if (accessToken) {
        navigation.navigate("BottomBar");
      } else {
        // console.error("Login error:", error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.navigate("SignUpOrLogin")}
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

          <Text style={styles.registerText}>Sign In</Text>

          <Formik
            initialValues={{ email: "", password: "" }}
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
                <View style={styles.inputContainer}>
                  <TextField
                    placeholder="Enter your password"
                    width={scale(310)}
                    height={scale(65)}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorMessage}>{errors.password}</Text>
                  )}
                </View>
                {loginError && (
                  <Text style={styles.errorMessage}>
                    {loginError === "User does not exist."
                      ? "User does not exist"
                      : loginError === "Invalid credentials."
                      ? "Invalid email or password"
                      : loginError}
                  </Text>
                )}
                <View style={styles.btnContainer}>
                  <ReuseBtn
                    onPress={handleSubmit}
                    btnText="Login"
                    textSize={scale(18)}
                    textColor="#ffffff"
                    width={scale(210)}
                    height={scale(65)}
                  />
                </View>
              </View>
            )}
          </Formik>

          <View style={styles.signInLinkContainer}>
            <Text style={styles.signInText}>Not a member? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.signInLink}>Register now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#121212",
  },
  backButtonContainer: {
    marginTop: scale(20),
    marginLeft: scale(15),
  },
  backButton: {
    width: scale(35),
    height: scale(35),
    borderRadius:scale(100),
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(10),
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: scale(24),
  },
  logo: {
    marginVertical: scale(10),
    width: scale(208),
    height: scale(150),
  },
  registerText: {
    fontSize: 30,
    color: COLOR.textPrimaryColor,
    marginBottom: 10,
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
