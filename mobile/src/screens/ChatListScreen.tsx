import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';

const ChatListScreen = ({ navigation, route }: any) => {
    const { user } = route.params;
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/users');
                setUsers(response.data.filter((u: any) => u.id !== user.id));
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, [user.id]);

    const startChat = (otherUser: any) => {
        // In this MVP, we use the combined sorted IDs as a simple conversation ID
        const conversationId = [user.id, otherUser.id].sort().join('_');
        navigation.navigate('Chat', { user, otherUser, conversationId });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userItem} onPress={() => startChat(item)}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text>
                        </View>
                        <View>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text style={styles.lastMessage}>Tap to chat</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    userItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#075E54', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    username: { fontSize: 18, fontWeight: 'bold' },
    lastMessage: { color: '#888' },
});

export default ChatListScreen;
