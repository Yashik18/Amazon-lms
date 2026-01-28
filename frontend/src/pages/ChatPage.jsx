import React, { useState } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import ChatInterface from '../components/Chat/ChatInterface';
import ChatSidebar from '../components/Chat/ChatSidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
    const [currentConversationId, setCurrentConversationId] = useState(null);

    const handleSelectConversation = (id) => {
        setCurrentConversationId(id);
    };

    const handleNewChat = () => {
        setCurrentConversationId(null);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4" component="h1">
                    ChatBot
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <ChatSidebar
                        currentConversationId={currentConversationId}
                        onSelectConversation={handleSelectConversation}
                        onNewChat={handleNewChat}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                    <ChatInterface
                        conversationIdProp={currentConversationId}
                        onConversationCreated={setCurrentConversationId}
                    />
                </Grid>
            </Grid>
            <ToastContainer position="bottom-right" />
        </Container>
    );
};

export default ChatPage;
