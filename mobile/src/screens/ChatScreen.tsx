import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';

const ChatScreen = ({ route }: any) => {
    const { user, otherUser, conversationId } = route.params;
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<any>(null);

    useEffect(() => {
        // Replace with your local machine IP
        socketRef.current = io('http://10.0.2.2:4000');

        socketRef.current.emit('join', conversationId);

        socketRef.current.on('message', (message: any) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [conversationId]);

    const sendMessage = () => {
        if (input.trim()) {
            socketRef.current.emit('sendMessage', {
                content: input,
                senderId: user.id,
                conversationId,
            });
            setInput('');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.senderId === user.id ? styles.myMessage : styles.theirMessage]}>
                        <Text style={styles.messageText}>{item.content}</Text>
                    </View>
                )}
                contentContainerStyle={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E5DDD5' },
    messageList: { padding: 10 },
    messageBubble: { padding: 10, borderRadius: 10, marginBottom: 10, maxWidth: '80%' },
    myMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
    theirMessage: { alignSelf: 'flex-start', backgroundColor: '#fff' },
    messageText: { fontSize: 16 },
    inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10 },
    sendButton: { backgroundColor: '#075E54', borderRadius: 20, padding: 10 },
    sendButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatScreen;
