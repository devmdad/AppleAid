import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CommentItem = ({comment}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.userName}>{comment.userName}</Text>
      <Text style={styles.commentText}>{comment.comment}</Text>
      <Text style={styles.timestamp}>{comment.createdAt}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    marginBottom: 5,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
});

export default CommentItem;
