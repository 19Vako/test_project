import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBlocks } from '../BlocksContext'; 

const { width, height } = Dimensions.get('window');

const EditItem: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { blocks, updateBlock } = useBlocks();

  const { selectedBlockId } = route.params as { selectedBlockId: number };

  const [blockWidthText, setBlockWidthText] = useState<string>('');
  const [blockHeightText, setBlockHeightText] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  useEffect(() => {
    const block = blocks.find(block => block.id === selectedBlockId);
    if (block) {
      setSelectedBlock(block);
      setBlockWidthText(String(block.width));
      setBlockHeightText(String(block.height));
    }
  }, [blocks, selectedBlockId]);

  const handleSave = () => {
    const widthValue = parseInt(blockWidthText, 10);
    const heightValue = parseInt(blockHeightText, 10);

    if (isNaN(widthValue) || isNaN(heightValue)) {
      Alert.alert("Invalid Input", "Please enter valid numbers");
      return;
    }

    if (widthValue > 2) {
      Alert.alert("Invalid Width", "Width cannot be greater than 2");
      return;
    }

    if (heightValue > 8) {
      Alert.alert("Invalid Height", "Height cannot be greater than 8");
      return;
    }

    if (selectedBlock) {
      updateBlock({ ...selectedBlock, width: widthValue, height: heightValue }); 
      navigation.goBack(); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Width</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Enter item width in cell number'
          value={blockWidthText}
          onChangeText={setBlockWidthText}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.title}>Height</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Enter item height in cell number'
          value={blockHeightText}
          onChangeText={setBlockHeightText}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.buttonAdd} onPress={handleSave}>
        <Text style={styles.buttonTitle}>EDIT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: height * 0.04,
  },
  inputContainer: {
    borderWidth: width * 0.003,
    borderColor: '#808080',
    color: 'black',
    marginHorizontal: width * 0.02,
    marginVertical: height * 0.01,
    paddingLeft: width * 0.02,
    paddingVertical: '1%',
  },
  title: {
    marginLeft: width * 0.02,
    fontSize: width * 0.05,
  },
  buttonAdd: {
    backgroundColor: '#3467EB',
    alignItems: 'center',
    paddingVertical: height * 0.01,
    marginTop: height * 0.01,
    marginHorizontal: width * 0.02,
  },
  buttonTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
});

export default EditItem;
