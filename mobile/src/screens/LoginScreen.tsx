import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleAuth = async () => {
        try {
            const endpoint = isRegister ? '/api/register' : '/api/login';
            const response = await api.post(endpoint, { username, password });
            const { token, user } = response.data;
            // In a real app, save token to SecurerStore
            navigation.replace('ChatList', { user });
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleAuth}>
                <Text style={styles.buttonText}>{isRegister ? 'Sign Up' : 'Log In'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
                <Text style={styles.toggleText}>
                    {isRegister ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#075E54' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15 },
    button: { backgroundColor: '#25D366', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    toggleText: { marginTop: 20, textAlign: 'center', color: '#34B7F1' },
});

export default LoginScreen;
