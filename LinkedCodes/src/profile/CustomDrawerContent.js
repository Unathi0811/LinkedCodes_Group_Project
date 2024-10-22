/*import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const CustomDrawerContent = (props) => {
    const { isDarkMode, state, descriptors, navigation } = props;
    const router = useRouter();

    return (
        <DrawerContentScrollView 
            {...props} 
            style={isDarkMode ? styles.darkBackground : styles.lightBackground}
        >
            <View style={styles.drawerContent}>
                {state.routes.map((route, index) => {
                    const { drawerLabel, drawerIcon } = descriptors[route.key].options;
                    const isFocused = state.index === index;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={[styles.customButton, isFocused && styles.focusedButton]}
                            onPress={() => router.push(route.name)} // Use router.push for navigation
                        >
                            {drawerIcon && drawerIcon({ color: '#FFFFFF', size: 24 })}
                            <Text style={styles.buttonText}>
                                {drawerLabel ?? route.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                <TouchableOpacity style={styles.customButton} onPress={() => alert('Logout')}>
                    <Icon name="logout" size={24} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        paddingHorizontal: 10,
    },
    darkBackground: {
        backgroundColor: '#202A44',
    },
    lightBackground: {
        backgroundColor: '#E6F0FF',
    },
    customButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#003366', // Dark Blue Button Background
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
    },
    focusedButton: {
        backgroundColor: '#005599', // Lighter blue for active item
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default CustomDrawerContent;
*/