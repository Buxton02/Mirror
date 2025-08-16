import { View, StyleSheet, Text, Pressable, Alert, Image, Modal, TextInput} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import arrow from '../../assets/icons/arrow.png';
import * as Haptics from 'expo-haptics';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, serverTimestamp,  getDocs, query, orderBy, doc, updateDoc} from 'firebase/firestore';
import { auth, db } from '../../assets/firebase/firebaseConfig';

export default function JournalLog({ title, body, timestamp, docId, uid, colour, onModalClose }) {
  const navigation = useNavigation();
  const [editmodalVisible, setEditModalVisible] = useState(false);
  const [colourModalVisible, setColourModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colour);
  const [editableTitle, setEditableTitle] = useState(title || '');

  const onPressJournalLog = () => {
     navigation.navigate('Log', {
        title,
        body,
        timestamp,
        docId, 
        uid    
    });
  };

  const onHoldJournalLog = () => {
    setSelectedColor(colour);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditModalVisible(true);
  };


  const saveColour = async () => {
    try {
      const uid = auth.currentUser.uid;
      const journalRef = doc(db, 'users', uid, 'journal', docId);

      await updateDoc(journalRef, {
        colour: selectedColor,
      });

    } catch (err) {
      console.error("Error saving journal entry:", err);
    }
  }

  const saveTitle = async () => {
    try {
      const uid = auth.currentUser.uid;
      const journalRef = doc(db, 'users', uid, 'journal', docId);

      await updateDoc(journalRef, {
        title: editableTitle,
      });

    } catch (err) {
      console.error("Error saving journal entry:", err);
    }
  }

  return (
    <>
      

      <Pressable
        style={[styles.container, { backgroundColor: colour }]}
        onPress={onPressJournalLog}
        onLongPress={onHoldJournalLog}
      >
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{(body && typeof body === 'string') ? body.slice(0, 10) + '...' : 'No content'}</Text>
          {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
        </View>
        <View>
          <Image source={arrow} style={styles.arrow}></Image>
        </View>
      </Pressable>

      <Modal
        transparent={true}
        visible={editmodalVisible}   
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <TextInput
                        style={styles.textInput}
                        multiline
                        value={editableTitle}
                        onChangeText={setEditableTitle}
                        placeholder={title || 'Untitled Entry'}
                      />

            <Pressable style={styles.saveButton} onPress={() => {
              setColourModalVisible(true)
              setEditModalVisible(false);}}>
              <Text style={styles.saveButtonText}>Change Colour</Text>
              <View style={{ backgroundColor: selectedColor, width: 20, height: 20, borderRadius: 10, marginLeft: 10, borderWidth: 2, borderColor:"#fff", }} />
            </Pressable>
            <Pressable style={styles.saveButton} onPress={() => {
              saveTitle();
              if (onModalClose) onModalClose();

              setEditModalVisible(false);
            }}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={colourModalVisible}   
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editModalContent, {height: '37%'}]}>
            <Text style={styles.editModalTitle}>Edit Colour</Text>

            <Pressable style={styles.saveButton} onPress={() => {
              saveColour();
              saveTitle();
              setColourModalVisible(false);
              if (onModalClose) onModalClose();
            }}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>

            <Picker
              selectedValue={selectedColor}
              style={{ height: 100, width: 200 }}
              onValueChange={(itemValue) => {
                setSelectedColor(itemValue);
              }}
            >
              <Picker.Item label="Green" value="#DDF6D2" />
              <Picker.Item label="Blue" value="#A8F1FF" />
              <Picker.Item label="Yellow" value="#fffaadff" />
              <Picker.Item label="Pink" value="#FFDCDC" />
              <Picker.Item label="Purple" value="#E0D1FF" />
              <Picker.Item label="Red" value="#FFB2B2" />
            </Picker>
            
            
          </View>
        </View>
      </Modal>
    </>
    
  );
}

const styles = StyleSheet.create({

container: {
    flex: 1,
  
    borderRadius: 10,
    width: '90%',
    minHeight: 60,
    marginVertical: 10,
    borderColor: 'black',
    borderWidth: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    
},
title: {
    fontSize: 18,
    fontWeight: 400,
    marginBottom: 5,
    color: '#333',
},
description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
},
arrow: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 10,
    transform: [{ rotate: '270deg' }],
},
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.4)',
},
editModalContent: {
  width: '80%',
  padding: 20,
  backgroundColor: '#fff',
  borderRadius: 10,
  alignItems: 'center',
},
editModalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
saveButton: {
  backgroundColor: '#FBB369',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  marginTop: 10,
  flexDirection: 'row',
  width: '60%',
},
saveButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
textInput: {
  height: 44,
  fontSize: 20,
  padding: 10,
  width: '60%',
  textAlignVertical: 'top',
},

});