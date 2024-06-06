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
import { COLOR } from "../../constant/color";
import scale from "../../constant/responsive";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        "https://c17d-2405-4802-a632-dc60-9df3-e7d9-e18e-caf7.ngrok-free.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong during registration.");
      }
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.navigate("SignUpOrLogin")}
          >
            <Ionicons name="chevron-back-sharp" size={24} color="black" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Image
            source={require("../../assets/images/logoSEarn.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.registerText}>Register</Text>

          <Formik
            initialValues={{ name: "", email: "", password: "" }}
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
                    placeholder="Name"
                    width={scale(310)}
                    height={scale(65)}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorMessage}>{errors.name}</Text>
                  )}
                </View>
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
                <View style={styles.btnContainer}>
                  <ReuseBtn
                    onPress={handleSubmit}
                    btnText="Register"
                    textColor="#ffffff"
                    width={scale(210)}
                    height={scale(65)}
                  />
                </View>
              </View>
            )}
          </Formik>

          <View style={styles.signInLinkContainer}>
            <Text style={styles.signInText}>Do you have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
