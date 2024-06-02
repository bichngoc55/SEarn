import {
  Modal as RNModal,
  ModalProps,
  KeyboardAvoidingView,
  View,
  Platform,
} from "react-native";

const Modal = (props) => {
  const { isOpen, withInput, children, ...rest } = props;

  const content = withInput ? (
    <KeyboardAvoidingView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: "rgba(63, 63, 70, 0.4)",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: "rgba(63, 63, 70, 0.4)",
      }}
    >
      {children}
    </View>
  );

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      {...rest}
    >
      {content}
    </RNModal>
  );
};

export default Modal;
