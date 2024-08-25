    import React from 'react';
    import { TouchableOpacity, StyleSheet, View } from 'react-native';
    import { useNavigation } from '@react-navigation/native';
    import { MaterialIcons } from '@expo/vector-icons';

    const CustomTabBarButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        >
        {children}
        </TouchableOpacity>
    );
    };

    const styles = StyleSheet.create({
    button: {
        top: -20, // Shift the button up
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#ff6347',
        borderWidth: 2,
        borderColor: 'wheat',
    },
    });

    export default CustomTabBarButton;
