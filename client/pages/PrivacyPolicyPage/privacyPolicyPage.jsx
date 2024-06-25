import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
  Animated,
  TouchableOpacity,
} from "react-native";
import { TabBar } from "react-native-tab-view";
import { COLOR } from "../../constant/color";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import scale from "../../constant/responsive";
export default function PrivacyPolicyPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const animatedContentStyles = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0],
        }),
      },
    ],
  };
  return (
    <View style={styles.container}>
      {/* back button */}
      <View style={styles.backButtonContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.navigate("UserProfile")}
        >
          <Ionicons name="chevron-back-sharp" size={scale(18)} color="black" />
        </Pressable>
      </View>

      {/* content */}
      <View style={styles.ThankYouContainer}>
        <Text style={styles.ThankYouText}>
          Cảm ơn bạn đã sử dụng Ứng dụng Âm nhạc của chúng tôi. Chính sách bảo
          mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ
          thông tin cá nhân của bạn khi bạn sử dụng Ứng dụng Âm nhạc của chúng
          tôi. Bằng cách truy cập hoặc sử dụng Ứng dụng Âm nhạc của chúng tôi,
          bạn đồng ý với những thực tiễn được mô tả trong Chính sách bảo mật
          này.
        </Text>
      </View>
      <TouchableOpacity onPress={toggleExpansion} style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>
            Chính sách bảo mật cho Ứng dụng Âm nhạc
          </Text>
          <TouchableOpacity onPress={toggleExpansion}>
            <Feather
              onPress={toggleExpansion}
              name="arrow-right-circle"
              size={scale(24)}
              color="white"
              style={[styles.icon, isExpanded && styles.rotatedIcon]}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.contentContainer, animatedContentStyles]}>
        {isExpanded && (
          <ScrollView style={styles.contentContainer}>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Nội dung</Text>
              <Text style={styles.contentText}>
                Chính sách bảo mật cho Ứng dụng Âm nhạc
              </Text>
            </View>

            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>
                Thu thập thông tin cá nhân
              </Text>
              <Text style={styles.contentText}>
                Chúng tôi có thể thu thập các thông tin cá nhân của bạn như tên,
                địa chỉ email và thông tin đăng nhập khi bạn tạo tài khoản trong
                ứng dụng. Chúng tôi cũng có thể thu thập thông tin về sở thích
                âm nhạc và hoạt động sử dụng ứng dụng để cải thiện trải nghiệm
                người dùng.
              </Text>
            </View>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Sử dụng thông tin cá nhân</Text>
              <Text style={styles.contentText}>
                Chúng tôi sử dụng thông tin cá nhân của bạn để cung cấp các dịch
                vụ và tính năng trong ứng dụng. Thông tin cá nhân cũng có thể
                được sử dụng để liên hệ với bạn, cung cấp thông tin về cập nhật
                sản phẩm, sự kiện và khuyến mãi đặc biệt.
              </Text>
            </View>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Bảo mật thông tin cá nhân</Text>
              <Text style={styles.contentText}>
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và áp dụng
                các biện pháp an ninh thích hợp để ngăn chặn truy cập trái phép,
                mất mát dữ liệu và sử dụng sai mục đích. Chúng tôi chỉ cho phép
                nhân viên có nhu cầu công việc truy cập thông tin cá nhân và yêu
                cầu họ tuân thủ các quy định bảo mật.
              </Text>
            </View>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Chia sẻ thông tin cá nhân</Text>
              <Text style={styles.contentText}>
                Chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba
                trừ khi có sự đồng ý của bạn hoặc theo yêu cầu của pháp luật.
                Chúng tôi có thể chia sẻ thông tin với các nhà cung cấp dịch vụ
                đáng tin cậy để hỗ trợ chúng tôi trong việc cung cấp ứng dụng và
                các chức năng liên quan.
              </Text>
            </View>
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1B1B",
  },
  scrollView: {
    flex: 1,
  },
  backButtonContainer: {
    marginTop: scale(27),
    marginLeft: scale(15),
  },
  backButton: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(100),
    backgroundColor: "rgba(211, 211, 211, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(10),
  },
  cardContainer: {
    borderRadius: 30,
    borderColor: COLOR.textPrimaryColor,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
  },
  cardText: {
    flex: 1,
    fontFamily: "regular",
    fontSize: scale(12),
    color: COLOR.textPrimaryColor,
    lineHeight: scale(20),
    fontFamily: "bold",
  },
  icon: {
    width: scale(24),
    height: scale(24),
    tintColor: "#3498db",
  },
  rotatedIcon: {
    transform: [{ rotate: "90deg" }],
  },
  contentContainer: {
    flex: 1,
    marginTop: scale(16),
  },
  contentSection: {
    paddingHorizontal: scale(16),
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: scale(15),
    fontFamily: "bold",
    marginBottom: scale(8),
    fontFamily: "regular",
    color: COLOR.btnBackgroundColor,
  },
  contentText: {
    fontSize: scale(13),
    lineHeight: scale(24),
    fontFamily: "regular",
    color: COLOR.textPrimaryColor,
  },
  ThankYouContainer: {
    marginTop: scale(20),
    marginLeft: scale(15),
  },
  ThankYouText: {
    fontSize: scale(12),
    lineHeight: scale(15),
    fontFamily: "regular",
    color: COLOR.textPrimaryColor,
  },
});
