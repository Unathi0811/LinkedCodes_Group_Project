import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

const ForgotPasswordScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Forgot Password</Text>
        </View>
    );
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
