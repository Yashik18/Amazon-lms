import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, isLoading }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
            {messages.length === 0 && (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Click "Send" to start a chat with the AI Tutor.
                </Box>
            )}
            {messages.map((msg, index) => (
                <MessageBubble
                    key={index}
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.timestamp || new Date()}
                    isNew={msg.isNew}
                />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
        </Box>
    );
};

export default MessageList;
