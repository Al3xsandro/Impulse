import React, { useState } from "react";
import { Alert, Keyboard, TextInput, View } from 'react-native';
import { api } from "../../service/api";

import { COLORS } from "../../theme";
import { Button } from "../Button";

import { styles } from "./style";

export function SendMessageForm(){
    const [message, setMessage] = useState('');
    const [sendingMessage, setSedingMessage] = useState(false);

    async function handleMessageSubmit() {
        const messageFormated = message.trim();

        if(messageFormated.length > 0){
            setSedingMessage(true);
            await api.post('/messages', {
                message: messageFormated
            })
    
            setMessage('');
            Keyboard.dismiss();
            setSedingMessage(false);
    
            Alert.alert('Mensagem enviada com sucesso!');
        }

        Alert.alert('Escreva a mensagem para enviar!')
    }
    
    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                keyboardAppearance="dark"
                placeholder="Qual sua espectativa para o evento?"
                placeholderTextColor={COLORS.GRAY_PRIMARY}
                multiline
                maxLength={140}
                onChangeText={setMessage}
                value={message}
                editable={!sendingMessage}
            />

            <Button 
                title="ENVIAR MENSAGEM"
                backgroundColor={COLORS.PINK}
                color={COLORS.WHITE}
                icon="inbox"
                isLoading={sendingMessage}
                onPress={handleMessageSubmit}
            />
        </View>
    )
}