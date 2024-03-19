import React, { useState, useEffect } from 'react';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Comment = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsSnapshot = await firestore()
          .collection('comments')
          .orderBy('createdAt', 'desc')
          .get();

        const commentsData = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          replies: [] // Initialize empty array for replies
        }));

        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  const handleReply = async (commentId, replyContent) => {
    try {
      // Create a new reply document
      const replyRef = await firestore()
        .collection('comments')
        .doc(commentId)
        .collection('replies')
        .add({
          content: replyContent,
          userId: firebase.auth().currentUser.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      // Add the reply to the parent comment's replies array
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...comment.replies, { id: replyRef.id, content: replyContent }]
              }
            : comment
        )
      );

      console.log('Reply added successfully');
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <button onClick={() => handleReply(comment.id, 'Your reply content')}>
            Reply
          </button>
          {comment.replies.map(reply => (
            <div key={reply.id}>
              <p>{reply.content}</p>
              {/* Reply actions */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Comment;
