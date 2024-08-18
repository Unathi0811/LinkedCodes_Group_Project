import { View, Text, StyleSheet,StatusBar } from 'react-native'; 

const SplashScreen = ({ navigation }) => {  
    setTimeout(() => {  
      navigation.replace('OnBoardingScreen_1');  
    }, 1000); 

  return (  
    <View style={styles.container}> 
        <StatusBar hidden={true}/> 
        <Text style={styles.title}>WELCOME TO LINKED </Text> 
    </View>  
  );  
};  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    backgroundColor: 'blue',  
  },  

  title: {  
    fontSize: 24,  
    color: '#fff',  
  },  
});  

export default SplashScreen;
