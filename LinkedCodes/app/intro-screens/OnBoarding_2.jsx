import React from 'react';  
import { View, Text, Button, StyleSheet,StatusBar,TouchableOpacity } from 'react-native';  

const OnBoardingScreen_2 = ({ navigation }) => {  
  return (  
    <View style={styles.container}>  
    <StatusBar hidden={false} barStyle="light-content" backgroundColor="#4a90e2"/>
      <Text style={styles.title}>Onboarding Screen 2</Text> 

      <TouchableOpacity style={styles.touchable} 
                        onPress={() => navigation.navigate('HomePage')} 
                        >
        <Text style={styles.ButtonText}> Getting Started </Text>

      </TouchableOpacity> 

        
    </View>  
  );  
};  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    padding: 10,  
    backgroundColor: '#4a90e2',  
  },  
  title: {  
    fontSize: 42,  
    color: '#fff',  
  },  
  touchable:{

  },
  ButtonText: {  
    fontSize: 16,  
    color: '#fff',  
    marginVertical: 20,  

  },  
});  

export default OnBoardingScreen_2;