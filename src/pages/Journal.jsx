import { View, StyleSheet, FlatList, ScrollView, Text, Image, Pressable, Modal, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import React from 'react';
import Title from '../components/Header/Title';
import Footer from '../components/Footer/Footer';
import AddFile from '../assets/icons/add-file.png';
import JournalLog from '../components/JournalMain/JournalLog';
import { collection, addDoc, serverTimestamp,  getDocs, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../assets/firebase/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';





export default function Journal() {
  const [modalVisible, setModalVisible] = useState(false);
  
  const [journalName, setJournalName] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);

  const onPressAddFile = () => {
    setModalVisible(true);
  };

  const handleCreateJournal = async () => {
    try {
      console.log('Creating journal with name:', journalName);
      const uid = auth.currentUser.uid;
      const journalRef = collection(db, 'users', uid, 'journal');

      await addDoc(journalRef, {
        title: journalName,
        body: '',
        timestamp: serverTimestamp(),
      });

      console.log("Journal entry saved.");
      setModalVisible(false);
      setJournalName('');
      loadJournalEntries(); // Reload entries after adding a new one
    } catch (err) {
      console.error("Error saving journal entry:", err);
    }
  };

  const loadJournalEntries = async () => {
    try {
      const uid = auth.currentUser.uid;
      const journalRef = collection(db, 'users', uid, 'journal');
      const q = query(journalRef, orderBy('timestamp', 'desc'));

      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setJournalEntries(entries);
      console.log("Loaded journal entries:", entries);
    } catch (error) {
      console.error("Error loading journal entries:", error);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      loadJournalEntries();
    }, [])
  );
  

  return (
    <>
      <Title />
      <View style={styles.topContainer}>
        <Text style={styles.title}>Journal</Text>
        <Pressable onPress={onPressAddFile}>
          <Image source={AddFile} style={styles.addFile} />
        </Pressable>
      </View>

      {/* Add Journal Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Journal Entry</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter journal name"
              value={journalName}
              onChangeText={setJournalName}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.createButton} onPress={handleCreateJournal}>
                <Text style={styles.buttonText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      

      <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent}>
        <View style={styles.userFiles}>
          {journalEntries.map(entry => (
            <JournalLog
              key={entry.id}
              docId={entry.id}
              uid={auth.currentUser.uid} 
              title={entry.title}
              body={entry.body}
              timestamp={entry.timestamp?.toDate().toLocaleString() || ''}
              colour={entry.colour || '#DFE1F7'} // Default colour if not set
              onModalClose={loadJournalEntries}
            />
          ))}
        </View>
      </ScrollView>
      <Footer tab={"Journal"} />
    </>
  );
}


const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    marginLeft: 40,

  },
  addFile: {
    width: 32,
    height: 32,
    marginRight: 40,
  },
  userFiles: {
    marginLeft: 20,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#FBB369',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});