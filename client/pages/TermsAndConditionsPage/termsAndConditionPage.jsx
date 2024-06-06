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

const Header = ({ onToggle, isExpanded }) => {
  const navigation = useNavigation();
  const [headerHeight, setHeaderHeight] = useState(new Animated.Value(100));

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    Animated.timing(headerHeight, {
      toValue: scrollY > 50 ? 0 : 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  return (
    <Animated.View
      style={[styles.headerContainer, { height: headerHeight }]}
      onLayout={(event) => {
        const height = event.nativeEvent.layout.height;
        setHeaderHeight(new Animated.Value(height));
      }}
    >
      <View style={styles.backButtonContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.navigate("UserProfile")}
        >
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </Pressable>
      </View>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.cardContainer}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>
            Khi sử dụng ứng dụng này, người dùng đồng ý tuân thủ các điều khoản
            và điều kiện sau
          </Text>
          <Feather
            name="arrow-right-circle"
            size={24}
            color="white"
            style={[styles.icon, isExpanded && styles.rotatedIcon]}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function TermsAndConditionsPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [headerOpacity, setHeaderOpacity] = useState(new Animated.Value(1));
  const [headerHeight, setHeaderHeight] = useState(new Animated.Value(100));

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
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    Animated.timing(headerHeight, {
      toValue: scrollY > 50 ? 0 : 100, // Adjust '50' for sensitivity
      duration: 200, // Adjust for animation speed
      useNativeDriver: false, // Required for height animation
    }).start();
  };
  return (
    <View style={styles.container}>
      {/* back button */}
      <Header onToggle={toggleExpansion} isExpanded={isExpanded} />
      <Animated.View
        style={[styles.contentContainer, animatedContentStyles, { flex: 1 }]}
      >
        {isExpanded && (
          <ScrollView
            style={styles.contentContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Nội dung</Text>
              <Text style={styles.contentText}>
                Người dùng chịu trách nhiệm đối với mọi nội dung do họ tải lên
                hoặc chia sẻ trên ứng dụng. Ứng dụng có quyền xóa bất kỳ nội
                dung nào vi phạm chính sách của ứng dụng.
              </Text>
            </View>

            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Bản quyền</Text>
              <Text style={styles.contentText}>
                Tất cả nội dung trong ứng dụng đều thuộc sở hữu của chủ sở hữu
                hoặc được cấp phép hợp pháp. Người dùng không được phép sao
                chép, phân phối hoặc sử dụng nội dung khi không được cho phép.
              </Text>
            </View>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Quyền riêng tư</Text>
              <Text style={styles.contentText}>
                Ứng dụng cam kết bảo vệ thông tin cá nhân của người dùng theo
                chính sách riêng tư. Người dùng đồng ý với việc thu thập và sử
                dụng dữ liệu như được mô tả trong chính sách.
              </Text>
            </View>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Trách nhiệm</Text>
              <Text style={styles.contentText}>
                Ứng dụng không chịu trách nhiệm về bất kỳ thiệt hại nào do việc
                sử dụng ứng dụng gây ra. Người dùng tự chịu trách nhiệm về mọi
                hành động của mình trên ứng dụng.
              </Text>
            </View>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Thay đổi điều khoản</Text>
              <Text style={styles.contentText}>
                Ứng dụng có quyền thay đổi các điều khoản và điều kiện này vào
                bất kỳ thời điểm nào. Việc tiếp tục sử dụng ứng dụng sau khi
                thay đổi được coi là sự chấp nhận của người dùng đối với các
                điều khoản mới.
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
  headerContainer: {
    backgroundColor: "#1C1B1B",
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
  cardContainer: {
    borderRadius: 30,
    marginHorizontal: 16,
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
    fontFamily: "bold",
    fontSize: scale(13),
    lineHeight: scale(20),
    color: COLOR.textPrimaryColor,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#3498db",
  },
  rotatedIcon: {
    transform: [{ rotate: "90deg" }],
  },
  contentContainer: {
    flex: 1,
    // marginTop: scale(16),
  },
  contentSection: {
    paddingHorizontal: scale(16),
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "bold",
    color: COLOR.btnBackgroundColor,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "regular",
    color: COLOR.textPrimaryColor,
  },
});
