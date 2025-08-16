import { View, StyleSheet, FlatList, ScrollView, Text, Pressable, Alert, Modal, TextInput} from 'react-native';
import { useState, useEffect } from 'react';
import Title from '../components/Header/Title';
import Footer from '../components/Footer/Footer';
import { auth, db } from '../assets/firebase/firebaseConfig';
import { doc, getDoc} from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';

export default function Account() {
    const navigation = useNavigation();
    const [userProfile, setUserProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const uid = auth.currentUser?.uid; // get current user ID
          if (!uid) return;

          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Data:", userData);
            setUserProfile(userData); // save it in local state
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      };

        fetchUserData();
    }, []);

    const handleChangePassword = async () => {
        try {
          const user = auth.currentUser;
          const credential = EmailAuthProvider.credential(user.email, currentPassword);

          // Step 1: Re-authenticate
          await reauthenticateWithCredential(user, credential);

          // Step 2: Update password
          await updatePassword(user, newPassword);

          Alert.alert("Success", "Password changed successfully.");
          setShowModal(false);
          setCurrentPassword('');
          setNewPassword('');
        } catch (error) {
          console.error("Password change error:", error);
          Alert.alert("Error", error.message);
        }
    };

    return(
        <>
        <Title/>
        <ScrollView 
            style={styles.mainContent}
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Your Account</Text>

            {userProfile ? (
              <>
                <View style={styles.subSection}>
                  <Text style={[styles.subTitle, styles.subTitleHeader]}>Email: </Text>
                  <Text style={styles.subTitle}>{userProfile.email}</Text>
                </View>
                <View style={styles.subSection}>
                  <Text style={[styles.subTitle, styles.subTitleHeader]}>Role: </Text>
                  <Text style={styles.subTitle}>{userProfile.role}</Text>
                </View>
              </>
            ) : (
              <Text>Loading...</Text>
            )}
            <View style={styles.buttonSection}>
              <Pressable style={styles.button} onPress={() => setShowModal(true)}>
                <Text style={{ fontSize: 16 }}>Change Password</Text>
              </Pressable>
              
              <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={{ fontSize: 16 }}>Sign Out</Text>
              </Pressable>
            </View>
        </ScrollView>
        <Modal visible={showModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Change Password</Text>
              <TextInput
                placeholder="Current Password"
                secureTextEntry
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TextInput
                placeholder="New Password"
                secureTextEntry
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Pressable style={styles.modalButton} onPress={handleChangePassword}>
                <Text style={{ color: '#fff' }}>Submit</Text>
              </Pressable>
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Footer tab={"Account"}/>
        </>
        
    );
}

const styles = StyleSheet.create({
  
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
  },
  scrollContent: {
    paddingBottom: 100, // give space above footer
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#FBB369',
    width: '70%',
  },
  subTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,

  },
  subTitleHeader: {
    fontWeight: 'bold',
    width: 100,
  },
  button: {
    backgroundColor: '#DFE1F7',
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '50%',
  },
  subSection: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  width: '80%',
  elevation: 5,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  padding: 10,
  marginVertical: 8,
},
modalButton: {
  backgroundColor: '#DFE1F7',
  padding: 10,
  alignItems: 'center',
  borderRadius: 8,
  marginTop: 10,
},
buttonSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});