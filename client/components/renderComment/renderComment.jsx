import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import scale from "../../constant/responsive";
import ReuseBtn from "../../components/buttonComponent";
import { COLOR } from "../../constant/color";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
const baseFontSize = scale(10);
const baseBorderRadius = scale(10);
const adjustedFontSize = Platform.OS === "ios" ? scale(7) : baseFontSize;
const adjustedBorderRadius =
  Platform.OS === "ios" ? scale(20) : baseBorderRadius;

const RenderComment = ({
  comment,
  toggleResponses,
  handlePostResponse,
  selectedCommentId,
  setModifiedComment,
  onDeleteComment,
  onSubmitModifiedComment,
}) => {
  const [newResponse, setNewResponse] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleReplyClick = (target, isResponse = false) => {
    setReplyingTo({ ...target, isResponse });
  };
  const toggleEdit = () => setIsEditing(!isEditing);

  const handleCancelReply = () => {
    setReplyingTo(null);
    setNewResponse("");
  };
  const handleDeleteComment = () => {
    onDeleteComment(comment._id);
  };

  const handleSaveModifiedComment = async () => {
    // console.log("heheheh: ", comment._id, " ", editContent);
    await setModifiedComment({ commentId: comment._id, content: editContent });
    await onSubmitModifiedComment({
      commentId: comment._id,
      content: editContent,
    });
    toggleEdit();
    setEditContent("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View key={comment._id} style={{ marginVertical: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {isEditing ? (
            <>
              <TextInput
                value={editContent}
                onChangeText={setEditContent}
                style={styles.editInput}
              />
              <TouchableOpacity onPress={handleSaveModifiedComment}>
                <Feather
                  style={{
                    marginRight: scale(10),
                    marginTop: scale(3),
                    marginLeft: scale(5),
                  }}
                  name="check"
                  size={24}
                  color="green"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleEdit}>
                <MaterialIcons
                  style={{ marginTop: scale(5) }}
                  name="cancel"
                  size={24}
                  color="red"
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Menu style={styles.menuTriggerContainer}>
                <MenuTrigger>
                  <Entypo
                    name="dots-three-vertical"
                    size={16}
                    color="grey"
                    style={{ marginLeft: "auto", marginTop: scale(10) }}
                  />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={toggleEdit} text="Modify" />
                  <MenuOption onSelect={() => onDeleteComment(comment._id)}>
                    <Text style={{ color: "red" }}>Delete</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </>
          )}
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text
            style={styles.btnAnswer}
            onPress={() => handleReplyClick(comment)}
          >
            Trả lời
          </Text>
          <Text
            style={{
              fontFamily: "light",
              fontSize: adjustedFontSize,
              color: "grey",
              marginTop: scale(5),
              marginBottom: scale(5),
            }}
          >
            {comment.userId.name}
          </Text>
          <Text
            style={{
              marginLeft: scale(10),
              alignContent: "center",
              marginTop: scale(5),
              color: "grey",
              fontSize: adjustedFontSize,
              fontFamily: "light",
            }}
          >
            {new Date(comment.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {comment.responses.length > 0 && (
            <View style={{ flex: 1, flexDirection: "column" }}>
              <Text
                style={styles.btnAnswer}
                onPress={() => toggleResponses(comment._id)}
              >
                {selectedCommentId === comment._id
                  ? "Ẩn phản hồi"
                  : "Xem phản hồi"}
              </Text>
              {selectedCommentId === comment._id && (
                <FlatList
                  data={comment.responses}
                  keyExtractor={(response) => response._id}
                  renderItem={({ item: response }) => (
                    <View
                      style={{ flex: 1, flexDirection: "column" }}
                      key={response._id}
                    >
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Text
                          style={{
                            padding: scale(5),
                            paddingHorizontal: scale(10),
                            color: "white",
                            fontFamily: "regular",
                            marginTop: scale(10),
                            marginLeft: -150,
                            backgroundColor: "grey",
                            borderRadius: adjustedBorderRadius,
                          }}
                        >
                          {response.content}
                        </Text>
                        <Menu style={styles.menuTriggerContainer}>
                          <MenuTrigger>
                            <Entypo
                              name="dots-three-vertical"
                              size={16}
                              color="grey"
                              style={{ marginTop: scale(22) }}
                            />
                          </MenuTrigger>
                          <MenuOptions>
                            <MenuOption
                              onSelect={() => onModifyComment(response)}
                              text="Modify"
                            />
                            <MenuOption
                              onSelect={() => onDeleteComment(response.id)}
                            >
                              <Text style={{ color: "red" }}>Delete</Text>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          marginTop: scale(5),
                          marginLeft: -150,
                        }}
                      >
                        <Text
                          style={styles.btnAnswer}
                          onPress={() => handleReplyClick(response, true)}
                        >
                          Trả lời
                        </Text>
                        <Text
                          style={{
                            color: "grey",
                            fontSize: adjustedFontSize,
                            fontFamily: "light",

                            marginTop: scale(5),
                            alignContent: "center",
                          }}
                        >
                          {response.userId.name}
                        </Text>
                        <Text
                          style={{
                            marginLeft: scale(10),
                            alignContent: "center",
                            marginTop: scale(5),
                            color: "grey",
                            fontSize: adjustedFontSize,
                            fontFamily: "light",
                          }}
                        >
                          {new Date(response.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              )}
            </View>
          )}
        </View>
        {replyingTo && (
          <View style={[styles.replyInputContainer]}>
            <Text
              style={{
                color: "white",
                fontFamily: "light",
                fontSize: adjustedFontSize,
                marginLeft: scale(20),
              }}
            >
              Đang trả lời{" "}
              {replyingTo.userId && replyingTo.userId.name
                ? replyingTo.userId.name
                : comment.userId.name}
              :
            </Text>
            <View style={styles.buttonContainer}>
              <TextInput
                value={newResponse}
                onChangeText={setNewResponse}
                placeholder="Viết phản hồi..."
                style={{
                  color: "grey",
                  marginLeft: scale(20),
                  fontSize: adjustedFontSize,
                }}
                placeholderTextColor={"grey"}
              />

              <TouchableOpacity
                onPress={handleCancelReply}
                style={{
                  color: "red",
                  fontFamily: "regular",
                  fontSize: adjustedFontSize,
                  marginLeft: scale(40),
                  marginRight: scale(10),
                }}
              >
                <MaterialIcons name="cancel" size={24} color="#FF0000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handlePostResponse(comment._id, newResponse, replyingTo?._id);
                  setNewResponse("");
                  setReplyingTo(null);
                }}
                style={{ marginLeft: scale(10) }}
              >
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  btnAnswer: {
    color: "white",
    fontFamily: "regular",
    fontSize: adjustedFontSize,
    alignContent: "center",
    alignItems: "center",
    marginTop: scale(3),
    paddingHorizontal: scale(10),
    borderRadius: adjustedBorderRadius,
  },
  commentContent: {
    color: "white",
    fontFamily: "regular",
    fontSize: scale(15),
    paddingVertical: scale(5),
    backgroundColor: "grey",
    paddingHorizontal: scale(10),
    marginTop: scale(15),
    borderRadius: adjustedBorderRadius,
  },
  btnSend: {
    color: "white",
    fontFamily: "regular",
    fontSize: adjustedFontSize,
    paddingVertical: scale(5),
    paddingHorizontal: scale(10),
    borderRadius: adjustedBorderRadius,
  },
  responseContainer: {
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 5,
    marginBottom: 5,
  },
  replyButton: {
    marginTop: 5,
    backgroundColor: "transparent",
    borderRadius: adjustedBorderRadius,
  },
  replyInputContainer: {
    marginTop: 10,
    marginLeft: scale(68),
  },
  replyingToText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: scale(20),
  },

  menuTriggerContainer: {
    marginLeft: "auto",
    marginRight: scale(10),
  },
  editInput: {
    flex: 1,
    color: "white",
    fontFamily: "regular",
    fontSize: adjustedFontSize,
    paddingVertical: scale(5),
    backgroundColor: "grey",
    paddingHorizontal: scale(10),
    marginTop: scale(15),
    borderRadius: adjustedBorderRadius,
  },
});

export default RenderComment;
