import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import * as yup from "yup";
import { COLOR } from "../../constant/color";
import ReuseBtn from "../../components/buttonComponent";
import scale from "../../constant/responsive";
import { Formik } from "formik";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Yup validation schema
const signInPayLoadSchema = yup.object({
  email: yup
    .string()
    .required("Email cannot be blank")
    .email("Invalid email")
    .max(50, "Email length must be less than 50 characters"),
  password: yup
    .string()
    .required("Password can not be blank")
    .min(6, "Password length must be more than 6 characters")
    .max(16, "Password length must be less than 16 characters")
    .matches(
      passwordRegex,
      "Password must contain uppercase, lowercase and number characters"
    ),
});

const LoginPage = () => {
  const handleSubmit = async (values) => {
    console.log(values);
  };
  const handlePress = () => {
    //navigation.navigate("HomePage");
    console.log("pressed");
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logoSEE.png")}
        style={styles.image}
      />
      <Text style={styles.textLogin}>Sign In</Text>

      <Text style={styles.textIfYouNeed}>
        If you need any support{" "}
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.textCLickMe}>Click Me</Text>
        </TouchableOpacity>
      </Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={signInPayLoadSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <TextInput
              placeholder="Email"
              onChangeText={handleChange("email")}
              value={values.email}
              style={styles.inputText}
            />
            {touched.email && errors.email && (
              <Text style={styles.text}>{errors.email}</Text>
            )}

            <TextInput
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
              style={styles.inputText}
            />
            {touched.password && errors.password && (
              <Text style={styles.text}>{errors.password}</Text>
            )}

            <View style={styles.stack}>
              <ReuseBtn
                btnText={"Login"}
                onPress={handleSubmit}
                textColor={COLOR.textPrimaryColor}
                width={scale(270)}
                height={scale(65)}
                borderColor={COLOR.textPrimaryColor}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.backgroundColor,
    height: "100%",
  },
  image: {
    width: "40%",
    position: "absolute",
    top: scale(50),
    height: scale(200),
    resizeMode: "contain",
  },
  text: {
    fontSize: scale(12),
    fontFamily: "light",
    color: "red",
    opacity: 0.7,
  },

  textLogin: {
    fontSize: scale(24),
    fontFamily: "bold",
    color: COLOR.textPrimaryColor,
    position: "absolute",
    top: scale(220),
  },
  textCLickMe: {
    fontSize: scale(12),
    fontFamily: "light",
    position: "absolute",
    color: COLOR.textLinkColor,
    top: scale(-12),
    margin: scale(0),
    padding: scale(0),
  },
  textIfYouNeed: {
    position: "absolute",
    fontFamily: "light",
    color: COLOR.textPrimaryColor,
    fontSize: scale(12),
    top: scale(270),
    left: scale(95),
  },
  stack: {
    position: "absolute",
    top: scale(80),
    //width: "80%",
    backgroundColor: COLOR.btnBackgroundColor,
    left: scale(-50),
  },
  inputText: {
    position: "absolute",
    width: scale(220),
    flex: 1,
    padding: scale(10),
    flexDirection: "column",
    height: scale(40),
    borderColor: "black",
    borderWidth: 1,
    borderRadius: scale(10),
    // padding: scale(10),
    // marginTop: scale(10),
    // marginBottom: scale(10),
    color: COLOR.textPrimaryColor,
    fontFamily: "regular",
  },
});

export default LoginPage;
