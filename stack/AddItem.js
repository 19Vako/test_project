import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useContext } from 'react';
import { ValueContext } from '../context';
import { useNavigation } from '@react-navigation/native';

export default function AddItem() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const { items, setItems } = useContext(ValueContext); 
  const navigation = useNavigation(); 

  const addItem = (width, height) => {
    const newItem = { id: (items.length + 1).toString(), width: parseInt(width), height: parseInt(height) };
    setItems([...items, newItem]);
    navigation.navigate('Home'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Width</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Enter item width in cell number'
          value={width}
          onChangeText={setWidth}
          keyboardType='numeric'
        />
      </View>

      <Text style={styles.title}>Height</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Enter item height in cell number'
          value={height}
          onChangeText={setHeight}
          keyboardType='numeric' 
        />
      </View>

      <TouchableOpacity style={styles.buttonAdd} onPress={() => addItem(width, height)}>
        <Text style={styles.buttonTitle}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    color: 'black',
    marginHorizontal: 8,
    marginVertical: 5,
    paddingLeft: 5,
  },
  title: {
    marginLeft: 8,
  },
  buttonAdd: {
    backgroundColor: '#3467EB',
    alignItems: 'center',
    padding: 10,
    marginTop: 8,
    marginHorizontal: 8,
  },
  buttonTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
});
