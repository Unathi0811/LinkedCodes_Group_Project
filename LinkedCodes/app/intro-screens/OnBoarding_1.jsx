
import React from 'react';  
import { View, Text, Button, StyleSheet,StatusBar,TouchableOpacity } from 'react-native';  

const OnBoardingScreen_1 = ({ navigation }) => {  
  return (  
    <View style={styles.container}>  
    <StatusBar hidden={false} barStyle="light-content" backgroundColor="#4a90e2"/>
      <Text style={styles.title}>Onboarding Screen 1</Text> 
      <TouchableOpacity style={styles.touchable} onPress={() => navigation.navigate('OnBoardingScreen_2')} >

        <Text style={styles.ButtonText}> Next </Text>
      </TouchableOpacity> 

        
    </View>  
  );  
};  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    padding: 16,  
    backgroundColor: '#4a90e2',  
  },  
  title: {  
    fontSize: 44,  
    color: 'black',  
  },  
  touchable:{
    
  },
  ButtonText: {  
    fontSize: 16,  
    color: '#fff',  
    marginVertical: 20,  

  },  
});  

export default OnBoardingScreen_1;