import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Title from '../components/Header/Title';
import Footer from '../components/Footer/Footer';
import { getChatGPTResponse } from '../utils/chatgpt';
import { auth, db } from '../assets/firebase/firebaseConfig';
import { doc, collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Hi, how can I support you today?' }
  ]);
  const [input, setInput] = useState('');

  const fetchMessages = async () => {
    if (!auth.currentUser) return;

    const userDoc = doc(db, 'users', auth.currentUser.uid);
    const messagesRef = collection(userDoc, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const snapshot = await getDocs(q);
    const loadedMessages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMessages(loadedMessages);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatMessagesForChatGPT = (msgs) => {
    return msgs.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();

    const userMessage = {
      text: userInput,
      sender: 'user',
      timestamp: serverTimestamp(),
    };

    const localUserMessage = {
      ...userMessage,
      id: Date.now().toString(),
    };

    setMessages(prev => [...prev, localUserMessage]);
    setInput('');

    // Save user message to Firestore
    try {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const messagesRef = collection(userDoc, "messages");
      await addDoc(messagesRef, userMessage);
    } catch (err) {
      console.error("Failed to save user message:", err);
    }

    // Get AI response with recent context
    try {
      const recentMessages = [...messages, localUserMessage].slice(-10); // limit to last 10 messages
      const formattedMessages = formatMessagesForChatGPT(recentMessages);

      const aiText = await getChatGPTResponse(formattedMessages);

      const aiMessage = {
        text: aiText,
        sender: 'ai',
        timestamp: serverTimestamp(),
      };

      const localAIMessage = {
        ...aiMessage,
        id: Date.now().toString() + Math.random().toString(36).slice(2),
      };

      setMessages(prev => [...prev, localAIMessage]);

      // Save AI message to Firestore
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const messagesRef = collection(userDoc, "messages");
      await addDoc(messagesRef, aiMessage);

    } catch (err) {
      console.error("Error fetching AI response:", err);
      const fallback = {
        text: "Sorry, I couldn't reach ChatGPT right now.",
        sender: 'ai',
        timestamp: serverTimestamp(),
      };
      const localFallback = { ...fallback, id: Date.now().toString() };
      setMessages(prev => [...prev, localFallback]);

      const userDoc = doc(db, "users", auth.currentUser.uid);
      const messagesRef = collection(userDoc, "messages");
      await addDoc(messagesRef, fallback);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
      >
        <Title />
        
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text>{item.text}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContainer}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={styles.textInput}
          />
          <Pressable onPress={handleSend} style={styles.sendButton}>
            <Text>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <Footer tab={"Chat"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { padding: 10 },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
    borderRadius: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FBB369',
    boxShadow: " rgba(251, 179, 105, 0.52) 0px 4px 6px, rgba(251, 178, 105, 0.29) 0px 12px 13px",
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#DFE1F7',
    boxShadow: " rgba(223, 225, 247, 0.52) 0px 4px 6px, rgba(223, 224, 247, 0.29) 0px 12px 13px",
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 20,
  },
  sendButton: {
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
});


