import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import { api } from "../../service/api";
import io from 'socket.io-client';

import { Message, MessageProps } from '../Message';

import { styles } from './style';

let messagesQueue: MessageProps[] = [];  

const socket = io('https://nlw-heat.herokuapp.com');
socket.on('new_message', (newMessage) => {
    messagesQueue.push(newMessage);
});

export function MessageList() {
    const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

    useEffect(() => {
        async function fetchMessages(){
            const messagesResponses = await api.post<MessageProps[]>('/messages/last3');
            setCurrentMessages(messagesResponses.data);
        }

        fetchMessages();
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            if(messagesQueue.length >= 0){
                setCurrentMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1]
                ]);

                messagesQueue.shift();
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [])

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="never"
        >
            {
                currentMessages.map((message) => {
                    <Message key={message.id} data={message} />
                })
            }
        </ScrollView>
    )
}