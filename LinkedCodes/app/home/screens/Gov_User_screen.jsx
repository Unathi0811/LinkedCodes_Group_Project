import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const Gov_User_screen = ({navigation}) => {
    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('LoginScreen')}
                >
                    <Text style={styles.buttonText}>Government</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    //Kelly!
                    // onPress={() => navigation.navigate('User')}
                >
                    <Text style={styles.buttonText}>User</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Gov_User_screen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: "#ffffff",
        flexDirection: "row",
        borderRadius: 20,
        marginHorizontal: 40,
        elevation: 10,
        marginVertical: 20,
        height: 50,
        width: '80%',
        justifyContent: "center",
        alignItems: "center",
        shadowOffset: { width: 3, height: 10 },
        shadowOpacity: 0.1,
        shadowColor: "#000",
    },
    buttonText: {
        textAlign: "center",
        color: "#000",
        fontSize: 16,
    }
})
