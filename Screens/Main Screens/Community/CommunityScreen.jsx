import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Share,
  Alert,
  useColorScheme,
} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../../constants/theme';
import CommentInputModal from './CommentInputModal';
import CommentItem from './CommentItem';
import storage from '@react-native-firebase/storage';

const CommunityScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    question: '',
    description: '',
    images: [],
  });
  const [selectedPost, setSelectedPost] = useState(null);

  const [newComment, setNewComment] = useState('');
  const [postIdForComment, setPostIdForComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const [showPostBox, setShowPostBox] = useState(false);
  const [fullPostModalVisible, setFullPostModalVisible] = useState(false); // State for full post modal
  const [fullPost, setFullPost] = useState(null); // State for full post content

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const [isCommentDeleted, setIsCommentDeleted] = useState(false);

  // const [postLiked, setPostLiked] = useState(false);
  // const [comments, setComments] = useState([]);

  const handleToggleCommentBox = postId => {
    setPostIdForComment(postId); // Set the post ID for comment
    setShowCommentBox(prev => !prev);
  };

  const handleToggleSearchInput = () => {
    setShowSearchInput(prevState => !prevState);
  };

  const handleSearch = () => {
    // Implement search logic here
    // Filter posts based on the searchQuery
    if (searchQuery === '') {
      setPosts(posts);
      return;
    }

    const filteredPosts = posts.filter(post =>
      post.question.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setPosts(filteredPosts);
  };

  const deletePost = async postId => {
    try {
      // Display confirmation popup
      Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await firestore().collection('posts').doc(postId).delete();
            console.log('Post deleted successfully');
          },
          style: 'destructive',
        },
      ]);
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
  };

  // Function to upload image to Firebase Storage
  const uploadImageToStorage = async uri => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    const uploadTask = firebase.storage().ref(filename).putFile(uri);

    try {
      await uploadTask;
      console.log('Image uploaded successfully');
      const downloadURL = await firebase
        .storage()
        .ref(filename)
        .getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to storage:', error);
      return null;
    }
  };

  useEffect(() => {
    // setIsCommentDeleted(false);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot && snapshot.docs) {
          const postData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            comments: [], // Initialize comments array for each post
          }));
          setPosts(postData);
          // Fetch comments for each post
          postData.forEach(post => {
            firestore()
              .collection('posts')
              .doc(post.id)
              .collection('comments')
              .orderBy('createdAt', 'desc')
              .get()
              .then(querySnapshot => {
                const comments = querySnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                // Update state with comments for the current post
                setPosts(prevPosts =>
                  prevPosts.map(prevPost =>
                    prevPost.id === post.id
                      ? {...prevPost, comments: comments}
                      : prevPost,
                  ),
                );
              })
              .catch(error => {
                console.error('Error fetching comments: ', error);
              });
          });
        }
      });

    return () => unsubscribe();
  }, [newComment, showSearchInput && searchQuery === '']);

  const handleShowPostBox = () => {
    setShowPostBox(!showPostBox);
  };

  const toggleCommentsVisibility = () => {
    setShowAllComments(!showAllComments);
  };
  const toggleSinglePostCommentsVisibility = () => {
    setShowAllComments(!showAllComments);
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    console.log('Launching image picker...');
    launchImageLibrary(options, response => {
      console.log('Image picker response:', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        const source = {uri: selectedImage.uri};
        console.log('Selected Image URI:', source.uri);

        // Update newPost.images with the selected image URI
        setNewPost(prevState => ({
          ...prevState,
          images: [...prevState.images, source.uri],
        }));
      } else {
        console.log('No image selected or invalid response format');
      }
    });
  };

  // Function to handle post creation
  const handlePost = async () => {
    if (!newPost.question || !newPost.description) {
      console.error('Question and description are required');
      return;
    }

    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.error('Error: Current user not found');
      return;
    }

    const {uid, displayName} = currentUser;

    try {
      const createdAt = new Date().toISOString();

      // Upload images to Firebase Storage and get their URLs
      const imageUrls = await Promise.all(
        newPost.images.map(async (imageUri, index) => {
          const imageName = `${uid}_${index}`; // Generate a unique name for the image
          return await uploadImageToStorage(imageUri, imageName);
        }),
      );

      // Add the post with image URLs to Firestore
      await firestore()
        .collection('posts')
        .add({
          userId: uid,
          userName: displayName || 'Anonymous',
          question: newPost.question,
          description: newPost.description,
          images: imageUrls, // Store image URLs instead of image data
          likes: [],
          comments: [],
          createdAt: createdAt,
        });

      setNewPost({question: '', description: '', images: []});
      console.log('Post added successfully');
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  const handleLike = async postId => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.error('Error: Current user not found');
        return;
      }
  
      // Get the post document from Firestore
      const postRef = firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();
  
      if (!postDoc.exists) {
        console.error('Error: Post does not exist');
        return;
      }
  
      // Check if the user has already liked the post
      const likes = postDoc.data().likes || [];
      const hasLiked = likes.includes(currentUser.uid);
  
      // Toggle like status
      let updatedLikes;
      if (hasLiked) {
        updatedLikes = likes.filter(uid => uid !== currentUser.uid);
      } else {
        updatedLikes = [...likes, currentUser.uid];
      }
  
      // Update the post document in Firestore with the updated likes array
      await postRef.update({likes: updatedLikes});
  
      await updateFullPostData(postId);
      console.log('Post like toggled successfully');
    } catch (error) {
      console.error('Error toggling like: ', error);
    }
  };

  const handleComment = async (postId, newComment) => {
    if (!postId || !newComment) {
      console.error('Comment and post ID are required');
      return;
    }

    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.error('Error: Current user not found');
        return;
      }

      // Add the comment to Firestore
      // const commentId = uuidv4();
      await firestore()
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .add({
          userId: currentUser.uid,
          userName: currentUser.displayName || 'Anonymous',
          comment: newComment,
          createdAt: new Date().toISOString(),
          // commentId: commentId,
        });

      console.log('Comment added successfully');
      setNewComment('');
      // Hide comment box
      setShowCommentBox(false);
      await updateFullPostData(postId);
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  // Inside your CommunityScreen component:
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [commentModalPostId, setCommentModalPostId] = useState(null);

  const handleCloseCommentModal = () => {
    setIsCommentModalVisible(false);
  };

  // Function to fetch the latest post data from Firestore
  const fetchPostData = async postId => {
    try {
      const postRef = firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();

      if (postDoc.exists) {
        const postData = {...postDoc.data(), id: postDoc.id};

        // Fetch comments associated with the post
        const commentsSnapshot = await firestore()
          .collection('posts')
          .doc(postId)
          .collection('comments')
          .orderBy('createdAt', 'desc') // Order comments by createdAt descending
          .get();

        const comments = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Add comments to postData
        postData.comments = comments;

        return postData;
      } else {
        console.error('Post does not exist');
        return null;
      }
    } catch (error) {
      console.error('Error fetching post data: ', error);
      return null;
    }
  };

  // Function to update the full post data and re-render the modal
  const updateFullPostData = useCallback(async postId => {
    try {
      const postData = await fetchPostData(postId);
      if (postData) {
        setFullPost(postData);
      }
    } catch (error) {
      console.error('Error updating full post data: ', error);
    }
  }, []);

  // const deleteComment = async (postId, commentId) => {
  //   try {
  //     // Display confirmation popup
  //     Alert.alert(
  //       'Delete Comment',
  //       'Are you sure you want to delete this comment?',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => console.log('Cancel Pressed'),
  //           style: 'cancel',
  //         },
  //         {
  //           text: 'Delete',
  //           onPress: async () => {
  //             await firestore()
  //               .collection('posts')
  //               .doc(postId)
  //               .collection('comments') // Target the comments subcollection
  //               .doc(commentId) // Target the specific comment document
  //               .delete();
  //             console.log('Comment deleted successfully');
  //           },
  //           style: 'destructive',
  //         },
  //       ],
  //     );
  //   } catch (error) {
  //     console.error('Error deleting comment: ', error);
  //   }
  // };

  const handleSubmitComment = async comment => {
    if (!postId || !comment) {
      console.error('Comment and post ID are required');
      return;
    }
    try {
      // Fetch the current user
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.error('Error: Current user not found');
        return;
      }

      // Add the comment to Firestore
      const commentId = uuidv4();
      await firestore()
        .collection('posts')
        .doc(commentModalPostId)
        .collection('comments')
        .add({
          userId: currentUser.uid,
          userName: currentUser.displayName || 'Anonymous',
          comment: comment,
          createdAt: new Date().toISOString(),
          commentId: commentId,
        });

      console.log('Comment added successfully');
      setNewComment('');
      // Hide comment box
      setShowCommentBox(false);
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  // Render the CommentInputModal component in your CommunityScreen

  const handleShare = async (postId, postText) => {
    try {
      const shareOptions = {
        message: postText, // The content you want to share
      };

      await Share.share(shareOptions);
      console.log('Post shared successfully');
    } catch (error) {
      console.error('Error sharing post: ', error);
    }
  };

  // Function to prompt the user for a comment input
  const promptForComment = () => {
    return new Promise((resolve, reject) => {
      // Implement your own logic to prompt the user for a comment input,
      // such as using a modal or a text input component.
      // For simplicity, you can use a prompt or an alert.
      // Example:
      const userComment = prompt('Enter your comment:');
      resolve(userComment);
    });
  };

  const openFullPostModal = async post => {
    try {
      await updateFullPostData(post.id);
      setPostIdForComment(post.id); // Set post ID for comment
      setShowCommentBox(false); // Hide comment box initially
      setFullPostModalVisible(true);
    } catch (error) {
      console.error('Error opening full post modal: ', error);
    }
  };

  const closeFullPostModal = () => {
    setFullPost(null);
    setFullPostModalVisible(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Community</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={handleShowPostBox}>
              <Icon
                name="pluscircle"
                size={24}
                color={showPostBox ? COLORS.gray : COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToggleSearchInput}>
              <Icon name="search1" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          {/* Render search input field */}
          {showSearchInput && (
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                paddingHorizontal: 10,
                marginLeft: 10,
              }}
              placeholder="Search..."
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
              onChange={handleSearch}
            />
          )}
        </View>
        {showPostBox && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Ask a question..."
              placeholderTextColor={COLORS.gray}
              value={newPost.question}
              onChangeText={text => setNewPost({...newPost, question: text})}
            />
            <TextInput
              style={[styles.input, {height: 150}]}
              placeholder="Write your description..."
              placeholderTextColor={COLORS.gray}
              multiline
              value={newPost.description}
              onChangeText={text => setNewPost({...newPost, description: text})}
            />
            {/* Render selected images */}
            {newPost.images.map((image, index) => (
              <Image key={index} source={{uri: image}} style={styles.image} />
            ))}
            <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
              <Text style={styles.buttonText}>Upload Images</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}
        {posts.map(post => (
          <TouchableOpacity
            key={post.id}
            style={styles.postContainer}
            onPress={() => openFullPostModal(post)}>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.postText}>{post.question}</Text>
            <Text style={styles.postText}>
              {post.description.length > 50
                ? post.description.substring(0, 50) + '...' // Show only first 50 characters of description
                : post.description}
            </Text>
            <ScrollView horizontal style={styles.imageContainer}>
              {post.images.map((image, index) => (
                <Image key={index} source={{uri: image}} style={styles.image} />
              ))}
            </ScrollView>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(post.id)}>
                <Icon
                  name="heart"
                  size={20}
                  color={
                    post.likes.includes(firebase.auth().currentUser?.uid)
                      ? COLORS.primary
                      : COLORS.gray
                  }
                />
                <Text style={{marginLeft: 6, color: 'gray'}}>
                  {post.likes.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShare(post.id, post.description)}>
                <Icon name="sharealt" size={20} color={COLORS.gray} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleToggleCommentBox(post.id)}>
                <Icon name="message1" size={20} color={COLORS.gray} />
                <Text style={{marginLeft: 6, color: 'gray'}}>
                  {post.comments.length}
                </Text>
              </TouchableOpacity>
            </View>
            {firebase.auth().currentUser.uid === post.userId && (
              <TouchableOpacity
                onPress={() => deletePost(post.id)}
                style={{marginTop: 16}}>
                <Icon name="delete" size={24} color="red" />
              </TouchableOpacity>
            )}
            {/* Comment box */}
            {showCommentBox && postIdForComment === post.id && (
              <View style={styles.commentBox}>
                <TextInput
                  placeholderTextColor="gray"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  style={styles.commentInput}
                />
                <TouchableOpacity
                  onPress={() => handleComment(postIdForComment, newComment)}
                  style={styles.commentButton}>
                  <Text style={styles.commentButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Full Post Modal */}
      <Modal visible={fullPostModalVisible} animationType="slide">
        <View style={modalStyles.container}>
          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={closeFullPostModal}>
            <Icon name="close" size={24} />
          </TouchableOpacity>
          {fullPost && (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 20,
                width: '90%',
                maxHeight: '80%',
              }}>
              <Text style={modalStyles.title}>{fullPost.question}</Text>
              <Text style={modalStyles.description}>
                {fullPost.description}
              </Text>
              <ScrollView horizontal style={modalStyles.imageContainer}>
                {fullPost.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{uri: image}}
                    style={modalStyles.image}
                  />
                ))}
              </ScrollView>
              <View style={modalStyles.actionsContainer}>
                <TouchableOpacity
                  style={modalStyles.actionButton}
                  onPress={() => handleLike(fullPost.id)}>
                  <Icon
                    name="heart"
                    size={20}
                    color={
                      fullPost.likes.includes(firebase.auth().currentUser?.uid)
                        ? COLORS.primary
                        : COLORS.gray
                    }
                  />
                  <Text style={{marginLeft: 6, color: 'gray'}}>
                    {fullPost.likes.length}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={modalStyles.actionButton}
                  onPress={() =>
                    handleShare(fullPost.id, fullPost.description)
                  }>
                  <Icon name="sharealt" size={20} color={COLORS.gray} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={modalStyles.actionButton}
                  onPress={() => handleToggleCommentBox(fullPost.id)}>
                  <Icon name="message1" size={20} color={COLORS.gray} />
                  <Text style={{marginLeft: 6, color: 'gray'}}>
                    {fullPost.comments.length}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Comment box */}
              {showCommentBox && postIdForComment === fullPost.id && (
                <View style={modalStyles.commentBox}>
                  <TextInput
                    placeholderTextColor="gray"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    style={modalStyles.commentInput}
                  />
                  <TouchableOpacity
                    onPress={() => handleComment(postIdForComment, newComment)}
                    style={modalStyles.commentButton}>
                    <Text style={modalStyles.commentButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Comments */}
              <View style={modalStyles.commentsContainer}>
                <ScrollView>
                  {fullPost.comments.map((comment, index) => (
                    <CommentItem key={index} comment={comment} />
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.bg,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    color: 'black',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
  },
  uploadButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postContainer: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  postText: {
    marginBottom: 5,
    color: 'black',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  fullPostContainer: {
    flex: 1,
  },
  fullPostText: {
    marginBottom: 10,
  },
  // Inside your styles object
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    color: 'black',
  },

  commentButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentButtonText: {
    color: '#fff',
  },
  commentsContainer: {
    marginTop: 10,
  },
  comment: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    color: 'black',
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    columnGap: 20,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  description: {
    marginBottom: 10,
    color: 'black',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    color: 'black',
  },
  commentButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentButtonText: {
    color: '#fff',
  },
  commentsContainer: {
    overflow: 'hidden',
    marginTop: 10,
    maxHeight: 200,
  },
});

export default CommunityScreen;
