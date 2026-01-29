import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import api from '../../services/api';

// Temporary mock user ID for MVP
// In real app, get from Auth Context
const MOCK_USER_ID = 'current_user_id';

const ChatInterface = ({ conversationIdProp, onConversationCreated }) => {
    const [messages, setMessages] = useState([]);
    // Use prop directly for logic, but keep local for "New Chat" -> "First Message" transition
    // Actually, we can just use a ref or derived state logic. 
    // But to minimize rewrite risk, let's just make the sync 100% reliable.
    const [activeId, setActiveId] = useState(conversationIdProp);
    const [loading, setLoading] = useState(false);

    const [isTyping, setIsTyping] = useState(false);

    // Reliable Sync: Whenever prop changes, update activeId and fetch/clear
    useEffect(() => {
        setActiveId(conversationIdProp);
        if (conversationIdProp) {
            fetchHistory(conversationIdProp);
        } else {
            setMessages([]);
        }
    }, [conversationIdProp]);

    // Fetch history helper
    const fetchHistory = async (id) => {
        setLoading(true);
        try {
            const res = await api.get(`/chat/history/${id}`);
            if (res.data.success) {
                // History messages are never "new"
                const loadedMsgs = (res.data.data.messages || []).map(m => ({ ...m, isNew: false }));
                setMessages(loadedMsgs);
            }
        } catch (error) {
            console.error("Failed to load history", error);
            toast.error("Could not load conversation history");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (text, attachments = []) => {
        // Optimistic update
        const userMsg = {
            role: 'user',
            content: text,
            attachments: attachments,
            timestamp: new Date()
        };

        // Clear previous isNew flags using map, then append new
        setMessages(prev => [...prev.map(m => ({ ...m, isNew: false })), userMsg]);

        // Don't set loading true here if we want to show the user message immediately without blocked UI
        // But we DO want to show a typing indicator. MessageList handles isLoading prop.
        setLoading(true);

        try {
            // Use activeId (from prop sync) OR prop itself. 
            // If we satisfy "New Chat", conversationIdProp is null.
            const res = await api.post('/chat/message', {
                message: text,
                conversationId: activeId,
                attachments: attachments
            });

            if (res.data.success) {
                const { conversationId: newConvId, message: aiMsg } = res.data.data;

                // If we started from null, notify parent to promote state
                if (!activeId) {
                    setActiveId(newConvId); // Update local temporarily
                    if (onConversationCreated) onConversationCreated(newConvId);
                }

                // Add AI response with animation flag
                // Mark ONLY this new message as isNew
                setIsTyping(true); // Start blocking input for typing effect
                setMessages(prev => [...prev.map(m => ({ ...m, isNew: false })), { ...aiMsg, isNew: true }]);
            }
        } catch (error) {
            console.error("Chat Error", error);
            const errorMsg = error.response?.data?.message || "Failed to send message";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 2
            }}
        >
            <MessageList
                messages={messages}
                isLoading={loading}
                onTypingComplete={() => setIsTyping(false)}
            />
            <MessageInput onSend={handleSendMessage} isLoading={loading || isTyping} />
        </Paper>
    );
};

export default ChatInterface;
