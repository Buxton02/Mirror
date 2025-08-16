import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../assets/firebase/firebaseConfig'; 

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (password !== confirm) {
      Alert.alert("Passwords don't match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        email: email,
        createdAt: new Date(),
        role: "user"
    });

      navigation.navigate("Home"); // or "Login", your choice
    } catch (error) {
      let message = "Something went wrong.";
      if (error.code === "auth/email-already-in-use") message = "That email is already registered.";
      if (error.code === "auth/invalid-email") message = "Please enter a valid email.";
      if (error.code === "auth/weak-password") message = "Password must be at least 6 characters.";

      Alert.alert("Signup Error", message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry onChangeText={setConfirm} />
      <Button title="Signup" onPress={handleSignup} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginPrompt}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    forgotPassword: {
        color: '#007BFF',
        textAlign: 'center',
        marginTop: 10,
    },
});