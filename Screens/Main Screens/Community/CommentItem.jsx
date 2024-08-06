import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';
import {differenceInMilliseconds, formatDistanceToNow} from 'date-fns';

const CommentItem = ({comment}) => {
  // const handleDelete = () => {
  //   // Call the onDelete function with the comment id
  //   onDelete(comment.commentId);
  // };

  // Function to format the comment date
  const formatCommentDate = createdAt => {
    const currentDate = new Date();
    const commentDate = new Date(createdAt);
    const difference = differenceInMilliseconds(currentDate, commentDate);
    return formatDistanceToNow(commentDate, {addSuffix: true});
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.userName}>{comment.userName}</Text>
        <Text style={styles.commentText}>{comment.comment}</Text>
        <Text style={styles.timestamp}>
          {formatCommentDate(comment.createdAt)}
        </Text>
      </View>

      {/* Delete comment button */}
      {/* <View>
        {auth().currentUser.uid === comment.userId && (
          <TouchableOpacity onPress={handleDelete}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  commentText: {
    marginBottom: 5,
    color: 'black',
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
});

export default CommentItem;
