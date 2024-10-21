import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const analytics = () => {
  return (
    <View 
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          marginBottom: 20,
        }}
      >Where we will have our graphs</Text>
    </View>
  )
}

export default analytics

const styles = StyleSheet.create({})