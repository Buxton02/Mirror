import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';

const Box = ({ colour, text, onThoughtAdded }) => {
  const [inputValue, setInputValue] = useState('');
  const [entries, setEntries] = useState([]);

  const handleAddEntry = () => {
    if (inputValue.trim() !== '') {
      const newEntry = inputValue.trim();
      setEntries(prev => [...prev, newEntry]);
      setInputValue('');

      // Notify parent component
      if (onThoughtAdded) {
        onThoughtAdded();
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colour}]}>
      <Text style={styles.title}>{text}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Type your thoughts here..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.button} title="Add" onPress={handleAddEntry}>
          <Text style={{color: '#000'}}>Add</Text>
        </TouchableOpacity>
      
      </View>
      <View style={styles.outputBox}>
        {entries.map((item, index) => (
          <Text key={index} style={styles.entry}>{item}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 10,
    color: '#fff',
  },
  button:{
    backgroundColor: '#fff',
    height: 40,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomEndRadius: 6,
    borderTopEndRadius: 6,
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.11)',
  },
  entry: {
    fontSize: 16,
    margin: '2px 0 0 3px',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  outputBox: {
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 100, 
    overflow: 'hidden', 
    padding: 4,
    gap: 5, 
},
  inputContainer: {
    flexDirection: 'row',  
    alignItems: 'center',
    marginBottom: 10,  
                  
  },
  input: {
    flex: 1,               
    height: 40,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
     
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.11)',    
  },
  
});

export default Box;
