import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, Pressable } from 'react-native';
import { getChatGPTResponse } from '../../utils/chatgpt';
import { auth, db } from '../../assets/firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';


export default function Daily() {

    const [aiText, setAiText] = useState('');

    const generateThought = async () => {
    try {
        const aiText = await getChatGPTResponse([
        { role: "user", content: "Write today's reminder for me. Keep it to one or two sentences." }
        ]);

        setAiText(aiText);

        if (!auth.currentUser) return;

        const userDoc = doc(db, 'users', auth.currentUser.uid);
        const reminderDoc = doc(userDoc, 'reminder', 'latest');  // <-- fixed ID 'latest'

        await setDoc(reminderDoc, {
        text: aiText,
        timestamp: serverTimestamp(),
        });

    } catch (error) {
        console.error("Error generating thought:", error);
    }
    };

    useEffect(() => {
        generateThought();
    }, []);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>A Thought for Today 💭</Text>
            <View style={styles.contentContainer}>
                <Text style={styles.content}>{aiText}</Text>
            </View>
            <Pressable onPress={generateThought} style={styles.button}>
                <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', color: "black", }}>Generate Thought ✨</Text>
            </Pressable>
            
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '80%',
        minHeight: 200,
        borderRadius: 10,
        marginVertical: 60,
        alignItems: 'center',
        backgroundColor: '#FBB369',
        marginHorizontal: '10%',
        boxShadow: "rgba(251, 178, 105, 0.28) 0px 25px 25px, rgba(251, 178, 105, 0.21) 0px -12px 30px, rgba(251, 179, 105, 0.12) 0px 4px 6px, rgba(251, 178, 105, 0.29) 0px 12px 13px, rgba(251, 178, 105, 0.21) 0px -3px 5px",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    contentContainer: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        fontSize: 18,
        color: '#333',
    },
    button: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.1) 0px -3px 5px",
    },
});