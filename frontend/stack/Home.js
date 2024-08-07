import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Slider from '../components/Slider'
import { useNavigation } from '@react-navigation/native';


export default function AddEdit() {

  const navigation = useNavigation(); 
  return (
    <ScrollView >
      <Slider navigation={navigation}/>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  
})