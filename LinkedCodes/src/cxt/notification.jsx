import React from 'react';
import { View, Button, Alert } from 'react-native';
import { usePermissions } from './PermissionContext';

const CameraFeature = () => {
    const { permissions } = usePermissions();

    const handleCameraAction = () => {
        if (!permissions.camera) {
            Alert.alert('Permission Denied', 'Camera access is required to use this feature.');
            return;
        }
        // Proceed with camera functionality
    };

    return (
        <View>
            <Button title="Open Camera" onPress={handleCameraAction} />
        </View>
    );
};
