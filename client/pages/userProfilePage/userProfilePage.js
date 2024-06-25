import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { COLOR } from "../../constant/color";
import ReuseBtn from "../../components/buttonComponent";
import { useNavigation } from "@react-navigation/native";
import scale from "../../constant/responsive";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextField from "../../components/textField";
import { logoutUser } from "../../redux/userSlice";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { refreshAccessToken } from "../../redux/userSlice";
import { updateUserName } from "../../redux/userSlice";
import Modal from "../../components/modal";
import * as ImagePicker from "expo-image-picker";
import SuccessfulModal from "../../components/successfulModal";

export default function UserPage() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [file, setFile] = useState(user?.ava);
  const handleChangeName = async () => {
    setIsEditing(true);
    setName(user.name);
  };
  const { accessTokenForSpotify } = useSelector(
    (state) => state.spotifyAccessToken
  );
  const handleSubmit = async () => {
    try {
      dispatch(logoutUser());
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("spotifyAccessToken");
      navigation.navigate("GettingStarted");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const [image, setImage] = useState(user?.avaURL);
  const [backgroundImage, setbackgroundImage] = useState(
    user?.backgroundImageUrl
  );
  // const makeAuthenticatedRequest = async (method, endpoint, data) => {
  //   try {
  //     console.log("Insidd make authenticate ");
  //     console.log("Data being sent:", JSON.stringify(data, null, 2));
  //     // console.log("avatar : " + JSON.stringifydata.avatar);
  //     const response = await axios({
  //       method: method, // 'PATCH' for updates
  //       url: `http://10.0.2.2:3005/auth/${user._id}/${endpoint}`,
  //       data: data,
  //       headers: {
  //         authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error updating ${endpoint}:`, error);
  //   }
  // };

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log("image " + result.assets[0].uri);
    if (!result.canceled) {
      const newFile = {
        uri: result.assets[0].uri,
        type: `test/${result.assets[0].uri.split(".").pop()}`,
        name: `${user._id}`,
      };
      if (type === "ava") {
        setImage(result.assets[0].uri);
      } else setbackgroundImage(result.assets[0].uri);

      const data = new FormData();
      data.append("file", newFile);
      data.append("upload_preset", "Searn-musicapp");
      data.append("cloud_name", "dzdso60ms");
      await fetch("https://api.cloudinary.com/v1_1/dzdso60ms/image/upload", {
        method: "POST",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          if (type === "ava") {
            updatedUserAva(data.url);
          } else updatedUserBackgroundImage(data.url);
        });
    }
  };
  const updatedUserAva = async (url) => {
    try {
      await axios({
        method: "PATCH",
        url: `http://10.0.2.2:3005/auth/${user._id}/ava`,
        data: { ava: url },
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  const updatedUserBackgroundImage = async (url) => {
    try {
      await axios({
        method: "PATCH",
        url: `http://10.0.2.2:3005/auth/${user._id}/backgroundImage`,
        data: { url: url },
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let intervalId;
    console.log("background : " + backgroundImage);
    const refreshTokens = async () => {
      const currentAccessToken = await AsyncStorage.getItem("userToken");
      if (!currentAccessToken) {
        console.log("No access token found, skipping refresh.");
        return;
      }
      try {
        const newAccessToken = await dispatch(
          refreshAccessToken(currentAccessToken)
        ).unwrap();
        console.log("Refreshed token:", newAccessToken);
        await AsyncStorage.setItem("userToken", newAccessToken);
      } catch (error) {
        console.error("Failed to refresh access token:", error);
      }
    };

    if (accessToken) {
      intervalId = setInterval(refreshTokens, 600000);
    }
    // 800000
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (accessToken) {
        try {
          console.log("Access Token is available:", accessToken);

          const storedAccessToken = await AsyncStorage.getItem("userToken");
          console.log("Stored Access Token:", storedAccessToken);
        } catch (error) {
          console.error(
            "Error fetching user data or using AsyncStorage:",
            error
          );
        }
      } else {
        // console.log("no access token");
      }
    };

    fetchUserProfile();
  }, [accessToken]);
  const handlePasswordChange = () => {
    navigation.navigate("ChangePassword");
  };

  const handleTermsPress = () => {
    navigation.navigate("TermsAndConditions");
  };
  const handlePrivacyPress = () => {
    navigation.navigate("PrivacyPolicy");
  };
  const submitNameChange = async () => {
    try {
      console.log("name : " + name);
      await axios({
        method: "PATCH",
        url: `http://10.0.2.2:3005/auth/${user._id}/name`,
        data: { name },
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      });
      setIsEditing(false);
      dispatch(updateUserName(name));
    } catch (error) {
      console.error(`Error updating name:`, error);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleChange = (text) => {
    setFeedback(text);
  };
  const handleSendReport = async (feedback) => {
    try {
      // console.log("content + email : ", feedback + user.email);
      const response = await axios.patch(
        `http://10.0.2.2:3005/report/${user._id}/addReport`,
        {
          content: feedback,
          email: user.email,
        }
      );
      closeModal();
      setFeedback("");
      setIsSuccessModalVisible(true);

      setTimeout(() => {
        setIsSuccessModalVisible(false);
      }, 4000);
    } catch (error) {
      console.error("Error sending report:", error);
    }
  };
  const handlePublicPlaylist = async () => {
    // navigation.navigate("publicPlaylist");
  };
  return (
    <BlurView intensity={isModalOpen ? 80 : 0} style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => pickImage("backgroundImage")}>
          <View style={styles.headerContainer}>
            <View style={[styles.backgroundImage, styles.roundedCorners]}>
              {backgroundImage ? (
                <ImageBackground
                  source={{ uri: backgroundImage }}
                  style={styles.backgroundImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.backgroundImagePlaceholder} />
              )}
            </View>
            <View style={styles.avatarOverlay}>
              <TouchableOpacity
                onPress={(e) => pickImage("ava")}
                style={styles.avatarContainer}
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarImagePlaceholder} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              onChangeText={setName}
              value={name}
              onSubmitEditing={submitNameChange}
            />
          ) : (
            <Text style={styles.nameInput}>{user?.name}</Text>
          )}
          <TouchableOpacity style={styles.editNameButton}>
            <AntDesign
              name="edit"
              size={22}
              color="white"
              onPress={handleChangeName}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={handlePasswordChange}
          >
            <MaterialIcons name="password" size={22} color="white" />
            <Text style={styles.itemText}>Password settings</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Options</Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Up to Date", "Your app is already up to date.");
            }}
            style={styles.itemContainer}
          >
            <MaterialIcons name="update" size={22} color="white" />
            <Text style={styles.itemText}>Check for updates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemContainer} onPress={openModal}>
            <MaterialIcons name="feedback" size={22} color="white" />
            <Text style={styles.itemText}>Give feedbacks & Report errors</Text>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <View style={styles.FeedbackContainer}>
                <Text style={styles.feedbackText}>
                  This is the feedback modal
                </Text>
                <TextField
                  placeholder="Enter your feedback"
                  width={scale(310)}
                  height={scale(65)}
                  onChangeText={handleChange}
                  // onBlur={handleBlur("")}
                  value={feedback}
                />
                <View style={styles.btnContainer2}>
                  <ReuseBtn
                    width={scale(120)}
                    height={scale(40)}
                    textSize={scale(15)}
                    btnText="Send Report"
                    onPress={() => handleSendReport(feedback)}
                  />
                  <TouchableOpacity
                    style={styles.btnClose}
                    onPress={closeModal}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: scale(15),
                        fontFamily: "regular",
                      }}
                    >
                      Close Modal
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <SuccessfulModal
              text={"You have sent report successfully"}
              isVisible={isSuccessModalVisible}
              onClose={() => setIsSuccessModalVisible(false)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={handleTermsPress}
          >
            <Ionicons name="document-text-outline" size={22} color="white" />
            <Text style={styles.itemText}>Terms and conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={handlePrivacyPress}
          >
            <MaterialIcons name="security" size={22} color="white" />
            <Text style={styles.itemText}>Privacy Policy</Text>
          </TouchableOpacity>
          <View style={styles.btnContainer}>
            <ReuseBtn
              onPress={handleSubmit}
              btnText="Log out"
              textColor="#ffffff"
              textSize={scale(18)}
              width={scale(280)}
              height={scale(50)}
            />
          </View>
          <View style={{ height: scale(150) }}></View>
        </ScrollView>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1B1B",
    width: "100%",
    height: "100%",
  },
  text1: {
    fontSize: scale(26),
    fontFamily: "blod",
    position: "absolute",
    top: scale(300),
  },
  text2: {
    fontSize: scale(16),
    fontFamily: "light",
    position: "absolute",
    top: scale(350),
    textAlign: "center",
  },
  headerContainer: {
    width: "100%",
    aspectRatio: 1.9,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "50%",
    marginTop: scale(60),
    justifyContent: "center",
  },
  nameInput: {
    color: COLOR.textPrimaryColor,
    fontFamily: "semiBold",
    width: "100%",
    fontSize: scale(15),
    borderBottomWidth: 1,
    textAlign: "center",
    alignSelf: "center",
  },
  stack: {
    position: "absolute",
    flex: 1,
    top: scale(420),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  scrollViewContent: {
    marginHorizontal: scale(20),
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: scale(6),
    marginHorizontal: scale(10),
  },
  itemText: {
    color: COLOR.textPrimaryColor,
    paddingHorizontal: scale(10),
    fontFamily: "regular",
    fontSize: scale(15),
  },
  avatarOverlay: {
    position: "absolute",
    bottom: -50,
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
  },
  avatarContainer: {
    width: scale(130),
    height: scale(130),
    borderColor: COLOR.textPrimaryColor,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: scale(100),
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#737163",
  },
  roundedCorners: {
    borderBottomLeftRadius: scale(40),
    borderBottomRightRadius: scale(40),
    overflow: "hidden",
  },
  sectionTitle: {
    color: COLOR.textPrimaryColor,
    fontFamily: "semiBold",
    fontSize: scale(18),
    marginTop: scale(20),
    marginBottom: scale(4),
  },
  btnContainer: {
    marginVertical: scale(20),
    alignItems: "center",
  },
  btnContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: scale(20),
    alignItems: "center",
    width: scale(280),
  },
  FeedbackContainer: {
    backgroundColor: "black",
    alignItems: "center",
    borderRadius: scale(20),
    width: scale(350),
  },
  feedbackText: {
    color: "white",
    fontSize: scale(18),
    marginTop: scale(20),
    marginBottom: scale(20),
    fontFamily: "bold",
    textAlign: "center",
  },
  btnClose: {
    width: scale(120),
    height: scale(40),
    fontFamily: "regular",
    padding: scale(10),
    backgroundColor: "red",
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
  },
});
