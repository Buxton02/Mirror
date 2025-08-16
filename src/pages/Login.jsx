import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { app, auth } from '../assets/firebase/firebaseConfig'; 
import { LinearGradient }from 'expo-linear-gradient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
          <Text style={styles.title}>Mirror</Text>
          <LinearGradient
              colors={['#AFCFF6', '#fff', '#A7C6ED']}
              start={{ x: 0, y: 0 }}  
              end={{ x: 1, y: 0 }} 
              style={styles.titleDot}
          />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.loginTitle}>Login</Text>
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
        <Button title="Login" onPress={handleLogin} />
        <TouchableOpacity onPress={() => console.log('Forgot Password pressed')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.forgotPassword}>Don't have an account? Signup</Text>
        </TouchableOpacity>
        </View>
      <View style={styles.placeholderContainer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'start',
        
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 40,
        fontWeight: '300',
        marginBottom: 20,
        textAlign: 'center',
        zIndex: 1,

    },
    loginTitle: {
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
    titleContainer: {
      position: 'relative',
      backgroundColor: '#fff',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

      flex: 1,
  },
    titleDot: {   
      width: 60,
      height: 60,
      borderRadius: 50,
      position: 'absolute',
      left: '41%',
      top: '34%',
      overflow: 'hidden',
      transform: [
        {scaleY: 2}
      ],
      
  },

    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    placeholderContainer: {
        flex: 1,
    },
});