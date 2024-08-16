import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


//Screens
import Main from     './stack/Main';
import EditItem from './stack/EditItem';
import AddItem  from './stack/AddItem';
import { BlocksProvider } from './BlocksContext';


const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');



export default function App() {  

  return (
    <BlocksProvider>
    <NavigationContainer>
       <Stack.Navigator screenOptions={{headerStyle: { backgroundColor: '#E6E6E6' }}}>

          <Stack.Screen 
            name='Home'
            component={Main}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Add Item')}>
                  <Text style={styles.title}>ADD</Text>
                </TouchableOpacity>
              )
            })}
          />

          <Stack.Screen 
            name='Add Item'
            component={AddItem}
          />

          <Stack.Screen 
            name='Edit Item'
            component={EditItem}
          />

       </Stack.Navigator>
    </NavigationContainer>
    </BlocksProvider>
  );
}

const styles = StyleSheet.create({
  Button: {
    backgroundColor: '#3467EB',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01
  },
  title: {
    color: 'white',
    fontWeight: 'bold'
  }
});
