import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import Home from './stack/Home';
import AddEdit from './stack/AddEdit';
import AddItem from './stack/AddItem';

const Stack = createStackNavigator();

function HeaderButton() {
  const navigation = useNavigation(); 

  return (
    <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate('AddItem')}>
      <Text style={styles.title}>ADD</Text>
    </TouchableOpacity>
  );
}

export default function Navigate() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E6E6E6',
          },
          headerTintColor: '#000',
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerRight: () => <HeaderButton />, 
          }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItem}
        />
        <Stack.Screen
          name="AddEdit"
          component={AddEdit}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  buttonAdd: {
    backgroundColor: '#3467EB',
    marginRight: 20,
    padding: 10,
    paddingHorizontal: 20,
   
  },
  title: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
