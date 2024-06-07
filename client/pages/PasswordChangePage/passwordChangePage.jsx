import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { COLOR } from "../../constant/color";
import scale from "../../constant/responsive";
import { useSelector, useDispatch } from "react-redux";

import ReuseBtn from "../../components/buttonComponent";
import TextField from "../../components/textField";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
const RegisterSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PasswordChangePage() {
  const navigation = useNavigation();

  const { user } = useSelector((state) => state.user);
  const { accessToken } = useSelector((state) => state.user);
  const handleSubmit = async (values) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      console.log("Retrieved token:", token);

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
      const response = await fetch(
        "http://localhost:3005/auth/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: user,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to change password");
      }

      const data = await response.json();
      console.log("Password changed successfully:", data);
      Alert.alert("Success", "Password changed successfully!", [
        { text: "OK", onPress: () => navigation.navigate("UserProfile") },
      ]);
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container1}>
      <View style={styles.backButtonContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.navigate("UserProfile")}
        >
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </Pressable>
      </View>
      <View style={styles.container}>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
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
            <View style={styles.btnContainer}>
              <View style={styles.inputContainer}>
                <TextField
                  placeholder="Enter your old password"
                  width={scale(310)}
                  height={scale(65)}
                  onChangeText={handleChange("oldPassword")}
                  onBlur={handleBlur("oldPassword")}
                  value={values.oldPassword}
                  secureTextEntry
                />
                {touched.oldPassword && errors.oldPassword && (
                  <Text style={styles.errorMessage}>{errors.oldPassword}</Text>
                )}
                <TextField
                  placeholder="Enter your new password"
                  width={scale(310)}
                  height={scale(65)}
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  value={values.newPassword}
                  secureTextEntry
                />
                {touched.newPassword && errors.newPassword && (
                  <Text style={styles.errorMessage}>{errors.newPassword}</Text>
                )}
                <TextField
                  placeholder="Reenter your new password"
                  width={scale(310)}
                  height={scale(65)}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  secureTextEntry
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorMessage}>
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>
              <View style={styles.btnContainer}>
                <ReuseBtn
                  onPress={handleSubmit}
                  btnText="Change Password"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(24),
  },
  backButtonContainer: {
    marginTop: scale(20),
    marginLeft: scale(15),
    marginBottom: scale(50),
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
  btnContainer: {
    marginTop: scale(20),
    alignItems: "center",
  },
  errorMessage: {
    color: "red",
  },
});
