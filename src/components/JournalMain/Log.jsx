import { View, StyleSheet, Text, TextInput, Pressable, Alert,Image, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import Title from '../Header/Title';
import Footer from '../Footer/Footer';
import { db, auth } from '../../assets/firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import arrow from '../../assets/icons/arrow.png';

export default function Log() {
  const navigation = useNavigation();
  const route = useRoute();

  const { title, body, timestamp, docId, uid } = route.params || {};

  // State for the editable journal body
  const [editableBody, setEditableBody] = useState('');

  // Update body when a new log is opened
  useEffect(() => {
    setEditableBody(route.params?.body || '');
  }, [route.params?.body]);

  const handleSave = async () => {
    if (!docId) {
      Alert.alert("Error", "Document ID is missing.");
      return;
    }

    try {
      const userId = uid || auth.currentUser?.uid;
      const entryRef = doc(db, 'users', userId, 'journal', docId);

      await updateDoc(entryRef, {
        body: editableBody,
      });

      //Alert.alert("Success", "Journal updated.");
      navigation.navigate('Journal'); 
    } catch (error) {
      console.error("Error updating journal:", error);
      Alert.alert("Error", "Failed to update journal entry.");
    }
  };

  return (
    <>
      <Title />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.topContainer}>
          <View style={styles.headingContainer}>
            <Pressable style={styles.back} onPress={handleSave}>
              <Image style={styles.arrow} source={arrow} />
            </Pressable>

            <View style={{ marginTop: 6 }}>
              <Text style={styles.title}>{title || 'Untitled Entry'}</Text>
              <Text style={styles.timestamp}>{timestamp || ''}</Text>
            </View>
          </View>

          <TextInput
            style={styles.textInput}
            multiline
            value={editableBody}
            onChangeText={setEditableBody}
            placeholder="Write your journal here..."
          />
        </View>
      </TouchableWithoutFeedback>
      <Footer tab={"Journal"} />
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headingContainer: {
    flexDirection: 'row',
    
    alignItems: 'center',
    marginBottom: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timestamp: {
    color: '#999',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  back: {
    backgroundColor: '#FBB369',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 20,
    width: '12%',
  },
  arrow: {
    width: 24,
    height: 34,
    marginRight: 2,
    resizeMode: 'contain',
    transform: [{ rotate: '90deg' }],
  },
  
});
