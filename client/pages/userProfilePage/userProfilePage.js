import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  Button,
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
  const [image, setImage] = useState(null);
  const [backgroundImage, setbackgroundImage] = useState(null);
  // const makeAuthenticatedRequest = async (method, endpoint, data) => {
  //   try {
  //     console.log("Insidd make authenticate ");
  //     console.log("Data being sent:", JSON.stringify(data, null, 2));
  //     console.log("Data being sent: " + data);
  //     const newaccessToken = await AsyncStorage.getItem("userToken");
  //     // const url2 = `http://localhost:3005/auth/${endpoint}`;
  //     // console.log("url2: " + url2);
  //     // console.log(
  //     //   "access token vs new access token : ",
  //     //   accessToken + " " + newaccessToken
  //     // );
  //     const response = await axios({
  //       method: method,
  //       url: `http://localhost:3005/auth/${endpoint}`,
  //       data: data,
  //       headers: {
  //         authorization: `Bearer ${newaccessToken}`,
  //         "content-type": "multipart/form-data",
  //       },
  //     });

  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error updating ${endpoint}:`, error);
  //   }
  // };

  // const pickImage = async (type) => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.canceled) {
  //     console.log("Image picked successfully:", result.assets[0].uri);
  //     const imageUri = result.assets[0].uri;
  //     const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
  //     const imageType = imageUri.substring(imageUri.lastIndexOf(".") + 1);

  //     if (type === "avatar") {
  //       setImage(imageUri);
  //     } else if (type === "backgroundImage") {
  //       setbackgroundImage(imageUri);
  //     }

  //     const formData = new FormData();
  //     console.log("den day r");
  //     const sendRequest = async () => {
  //       if (type === "avatar") {
  //         formData.append("avatar", {
  //           uri: imageUri,
  //           type: `image/${imageType}`,
  //           name: imageName,
  //         });
  //         await makeAuthenticatedRequest("PATCH", "ava", formData);
  //       } else if (type === "backgroundImage") {
  //         formData.append("backgroundImage", {
  //           uri: imageUri,
  //           type: `image/${imageType}`,
  //           name: imageName,
  //         });
  //         await makeAuthenticatedRequest("PATCH", "backgroundImage", formData);
  //       }
  //     };

  //     await sendRequest();
  //   }
  // };
  const makeAuthenticatedRequest = async (method, endpoint, data) => {
    try {
      console.log("Insidd make authenticate ");
      console.log("Data being sent:", JSON.stringify(data, null, 2));
      // console.log("avatar : " + JSON.stringifydata.avatar);
      const response = await axios({
        method: method, // 'PATCH' for updates
        url: `http://localhost:3005/auth/${user._id}/${endpoint}`,
        data: data,
        headers: {
          authorization: `Bearer ${accessToken}`,
          // "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
    }
  };

  const pickImage = async (type) => {
    // try {
    //   const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //   if (status !== 'granted') {
    //     alert('Sorry, we need camera roll permissions to make this work!');
    //     return;
    //   } else {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const imageType = imageUri.substring(imageUri.lastIndexOf(".") + 1);
      // console.log("result uri : " + result.uri);
      if (type === "avatar") {
        setImage(imageUri);
      } else if (type === "backgroundImage") {
        setbackgroundImage(imageUri);
      }

      const formData = new FormData();

      if (type === "avatar") {
        formData.append("avatar", {
          uri: imageUri,
          name: imageName,
          type: `image/${imageType}`,
        });
        await makeAuthenticatedRequest("PATCH", "ava", formData);
      } else if (type === "backgroundImage") {
        formData.append("backgroundImage", {
          uri: imageUri,
          name: imageName,
          type: `image/${imageType}`,
        });
        console.log("o day r");
        await makeAuthenticatedRequest("PATCH", "backgroundImage", formData);
        console.log("o day r");
      }
    }
  };
  useEffect(() => {
    let intervalId;

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
        console.log("no access token");
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
        url: `http://localhost:3005/auth/${user._id}/name`,
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
        `http://localhost:3005/report/${user._id}/addReport`,
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
    navigation.navigate("publicPlaylist");
  };
  return (
    <BlurView intensity={isModalOpen ? 80 : 0} style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => pickImage("backgroundImage")}>
          <View style={styles.headerContainer}>
            <View style={[styles.backgroundImage, styles.roundedCorners]}>
              <ImageBackground
                source={{ uri: backgroundImage }}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.avatarOverlay}>
              <TouchableOpacity
                onPress={() => pickImage("avatar")}
                style={styles.avatarContainer}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
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
              size={24}
              color="white"
              onPress={handleChangeName}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollViewContent}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handlePasswordChange}
          >
            <MaterialIcons name="password" size={24} color="white" />
            <Text style={styles.settingText}>Password settings</Text>
          </TouchableOpacity>
          {/* publicPlaylist */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handlePublicPlaylist}
          >
            <MaterialIcons name="password" size={24} color="white" />
            <Text style={styles.settingText}>Public Playlist</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Options</Text>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="update" size={24} color="white" />
            <Text style={styles.settingText}>Check for updates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={openModal}>
            <MaterialIcons name="feedback" size={24} color="white" />
            <Text style={styles.settingText}>
              Give feedbacks & Report errors
            </Text>
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
                    width={scale(150)}
                    height={scale(60)}
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
                        fontSize: scale(18),
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
            style={styles.settingItem}
            onPress={handleTermsPress}
          >
            <Ionicons name="document-text-outline" size={24} color="white" />
            <Text style={styles.settingText}>Terms and conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handlePrivacyPress}
          >
            <MaterialIcons name="security" size={24} color="white" />
            <Text style={styles.settingText}>Privacy Policy</Text>
          </TouchableOpacity>
          <View style={styles.btnContainer}>
            <ReuseBtn
              onPress={handleSubmit}
              btnText="Log out"
              textColor="#ffffff"
              width={scale(210)}
              height={scale(65)}
            />
          </View>
        </ScrollView>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1B1B",
    alignItems: "center",
    width: "100%",
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

  headerContainer: {
    width: "100%",
    aspectRatio: 1.9,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginTop: scale(60),
    justifyContent: "center",
  },
  nameInput: {
    color: COLOR.textPrimaryColor,
    fontFamily: "regular",
    width: "100%",
    fontSize: scale(15),
    borderBottomWidth: 1,
    textAlign: "center",
  },
  stack: {
    position: "absolute",
    flex: 1,
    top: scale(420),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: scale(10),
  },
  settingText: {
    color: COLOR.textPrimaryColor,
    paddingLeft: scale(10),
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
    fontFamily: "regular",
    fontSize: scale(20),
    fontWeight: "bold",
    marginTop: scale(20),
  },
  btnContainer: {
    marginTop: scale(20),
    marginBottom: scale(20),
    alignItems: "center",
  },
  btnContainer2: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: scale(20),
    marginBottom: scale(20),
    alignItems: "center",
  },
  FeedbackContainer: {
    backgroundColor: "black",
    alignItems: "center",
    borderRadius: scale(20),
  },
  feedbackText: {
    color: "white",
    fontSize: scale(20),
    fontWeight: "bold",
    marginTop: scale(20),
    marginBottom: scale(20),
    fontFamily: "regular",
    textAlign: "center",
  },
  btnClose: {
    width: scale(150),
    height: scale(60),
    marginLeft: scale(20),
    fontFamily: "regular",

    marginRight: scale(10),
    backgroundColor: "red",
    borderRadius: scale(15),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
  },
});
