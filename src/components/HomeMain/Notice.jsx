import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Pressable } from 'react-native';
import Box from './Box';
import { useNavigation } from '@react-navigation/native';

import emoji1 from '../../assets/1.png';
import emoji2 from '../../assets/2.png';
import emoji3 from '../../assets/3.png';
import emoji4 from '../../assets/4.png';
import emoji5 from '../../assets/5.png';

const Notice = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  const handleThoughtAdded = () => {
    setShowPrompt(true);
  };

  const [selectedMoodIndex, setSelectedMoodIndex] = useState(null);

  const handleMoodPress = (moodIndex, emoji) => {
    setSelectedMoodIndex(moodIndex);
    console.log(`Mood selected: ${moodIndex}`);
  }

  const navigation = useNavigation();
  return (
    <View style={styles.notice}>
      <Text style={[styles.spacing, styles.title]}>Gentle Reflection</Text>
      <Text style={styles.spacing}>How are you feeling right now?</Text>

      <View style={[styles.moodContainer, styles.spacing]}>
        {[emoji1, emoji2, emoji3, emoji4, emoji5].map((emoji, idx) => {
          const isSelected = selectedMoodIndex === idx;
          return (
            <Pressable
              style={[styles.moodOption, isSelected && styles.selectedMood]}
              key={idx}
              onPress={() => handleMoodPress(idx)}
            >
              <Image source={emoji} style={styles.emojiImage} />
            </Pressable>
          );
        })}
      </View>

      <Box colour="#FBB369" text="My Body Feels..."/>
      <Box colour="#DFE1F7" text="I'm Thinking..." onThoughtAdded={handleThoughtAdded} />

      {showPrompt && (
        <View style={styles.promptContainer}>
          <Text style={styles.spacing}>Thank you for noticing.</Text>
          <Text style={styles.spacing}>
            You don’t need to fix it –{'\n'}just being with it is powerful.
          </Text>
          <Button title="Would you like to talk about it?" onPress={() => navigation.navigate("Chat")} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notice: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  title:{
    fontSize: 28,
    fontWeight: 300,
    marginBottom: 30,
    color: '#000',
  },
  spacing: {
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 20,
  },
  moodOption: {
    padding: 5,
    
  },
  selectedMood: {
    backgroundColor: '#B6E3FF', 
    borderWidth: 2,
    borderColor: '#007AFF',
  },

  emojiImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  promptContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default Notice;