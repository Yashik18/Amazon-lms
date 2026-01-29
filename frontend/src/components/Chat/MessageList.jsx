import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, isLoading, onTypingComplete }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const isAtBottom = useRef(true); // Track if user is at bottom

    const scrollToBottom = () => {
        if (isAtBottom.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle user scroll to update "isAtBottom" state
    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            // 50px threshold to consider "at bottom"
            const atBottom = scrollHeight - scrollTop - clientHeight < 50;
            isAtBottom.current = atBottom;
        }
    };

    // Force scroll on new matching messages if we were already at bottom
    // Or if it's the very first load
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <Box
            ref={containerRef}
            onScroll={handleScroll}
            sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}
        >
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
                    attachments={msg.attachments}
                    onTypingComplete={onTypingComplete}
                    onTyping={scrollToBottom}
                />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
        </Box>
    );
};

export default MessageList;
