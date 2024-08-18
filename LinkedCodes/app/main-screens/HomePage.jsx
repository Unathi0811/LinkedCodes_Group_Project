import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'

const HomePage = () => {
  return (
    <View style={styles.container} >
      <StatusBar  barStyle='default'/>

      <Text style={styles.text} >HomePage</Text>
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',   
    backgroundColor: '#636e72',  
  },
  text:{
    fontSize:50,
    color:'#fff'
  },
})