import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import React, { useState } from 'react';
import { useBlocks } from '../BlocksContext';


const { width, height } = Dimensions.get('window');

type AddItemProps = {
  route: any;
  navigation: any;
};

const AddItem: React.FC<AddItemProps> = ({ route, navigation }) => {
  const [heightBox, setHeightBox] = useState<string>('');
  const [widthBox, setWidthBox] = useState<string>('');
  const { addBlock } = useBlocks(); 

  const handleHeightChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      const heightValue = text === '' ? 0 : parseInt(text, 10);
      if (heightValue <= 8) {
        setHeightBox(text);
      } else {
        Alert.alert("Invalid Height", "Height cannot be greater than 8");
      }
    } else {
      Alert.alert("Invalid Input", "Please enter numbers only");
    }
  };

  const handleWidthChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      const widthValue = text === '' ? 0 : parseInt(text, 10);
      if (widthValue <= 2) {
        setWidthBox(text);
      } else {
        Alert.alert("Invalid Width", "Width cannot be greater than 2");
      }
    } else {
      Alert.alert("Invalid Input", "Please enter numbers only");
    }
  };

  const addBlockHandler = () => {
    const widthValue = parseInt(widthBox, 10);
    const heightValue = parseInt(heightBox, 10);

    if (widthValue > 0 && heightValue > 0) {
      const newBlock = {
        id: Date.now(), 
        width: widthValue,
        height: heightValue
      };
      addBlock(newBlock); 
      setWidthBox('');
      setHeightBox(''); 
      navigation.goBack(); 
    } else {
      Alert.alert("Invalid Input", "Please enter valid width and height");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Width</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Enter item width in cell number'
          value={widthBox}
          onChangeText={handleWidthChange}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.title}>Height</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Enter item height in cell number'
          value={heightBox}
          onChangeText={handleHeightChange}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.buttonAdd} onPress={addBlockHandler}>
        <Text style={styles.buttonTitle}>ADD</Text>
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

export default AddItem;
