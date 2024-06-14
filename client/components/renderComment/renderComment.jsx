import React, { useState } from "react";
import { View, Text, Button, FlatList } from "react-native";

const renderComment = ({
  comment,
  toggleResponses,
  handlePostResponse,
  selectedCommentId,
}) => {
  const [newResponse, setNewResponse] = useState("");

  return (
    <View key={comment._id} style={{ marginVertical: 5 }}>
      <Text>{comment.content}</Text>
      <Button title="Trả lời" onPress={() => toggleResponses(comment._id)} />
      {comment.responses.length > 0 && (
        <View>
          <Button
            title={
              selectedCommentId === comment._id ? "Ẩn phản hồi" : "Xem phản hồi"
            }
            onPress={() => toggleResponses(comment._id)}
          />
          {selectedCommentId === comment._id && (
            <FlatList
              data={comment.responses}
              keyExtractor={(response) => response._id}
              renderItem={({ item: response }) => (
                <View key={response._id}>
                  <Text>{response.content}</Text>
                </View>
              )}
            />
          )}
        </View>
      )}
      {selectedCommentId === comment._id && (
        <View>
          <TextInput
            value={newResponse}
            onChangeText={setNewResponse}
            placeholder="Viết phản hồi..."
          />
          <Button
            title="Gửi"
            onPress={() => {
              handlePostResponse(comment._id, newResponse);
              setNewResponse("");
            }}
          />
        </View>
      )}
    </View>
  );
};

export default renderComment;
