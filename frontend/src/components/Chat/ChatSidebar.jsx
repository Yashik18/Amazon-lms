import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, List, ListItem, ListItemText, Typography, Button, Paper, Divider, ListItemButton, Skeleton, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ChatSidebar = ({ currentConversationId, onSelectConversation, onNewChat }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null });

    useEffect(() => {
        fetchConversations();
    }, [currentConversationId]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat');
            setConversations(res.data.data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestDelete = (e, id) => {
        e.stopPropagation();
        setDeleteConfirmation({ open: true, id });
    };

    const handleCloseDelete = (e) => {
        if (e) e.stopPropagation();
        setDeleteConfirmation({ open: false, id: null });
    };

    const handleConfirmDelete = async () => {
        const id = deleteConfirmation.id;
        handleCloseDelete(); // Close optimistic

        try {
            await api.delete(`/chat/${id}`);
            toast.success("Conversation deleted");
            fetchConversations();
            if (currentConversationId === id) {
                onNewChat();
            }
        } catch (error) {
            console.error("Failed to delete", error);
            toast.error("Failed to delete conversation");
        }
    };

    return (
        <Paper sx={{ height: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onNewChat}
                >
                    New Chat
                </Button>
            </Box>
            <Divider />

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        {[1, 2, 3].map(i => <Skeleton key={i} height={60} sx={{ mb: 1 }} />)}
                    </Box>
                ) : conversations.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                        <ChatBubbleOutlineIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                        <Typography variant="body2">No conversations yet.</Typography>
                    </Box>
                ) : (
                    <List>
                        {conversations.map((conv) => (
                            <ListItem
                                key={conv._id}
                                disablePadding
                                sx={{
                                    '&:hover .delete-btn': { opacity: 1 },
                                }}
                                secondaryAction={
                                    <IconButton
                                        className="delete-btn"
                                        edge="end"
                                        aria-label="delete"
                                        onClick={(e) => handleRequestDelete(e, conv._id)}
                                        size="small"
                                        sx={{ opacity: 0, transition: 'opacity 0.2s' }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <ListItemButton
                                    selected={currentConversationId === conv._id}
                                    onClick={() => onSelectConversation(conv._id)}
                                    sx={{
                                        borderLeft: currentConversationId === conv._id ? '4px solid #ff9900' : '4px solid transparent',
                                    }}
                                >
                                    <ListItemText
                                        primary={conv.title}
                                        secondary={conv.preview}
                                        primaryTypographyProps={{ noWrap: true, variant: 'subtitle2' }}
                                        secondaryTypographyProps={{ noWrap: true, variant: 'caption' }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <Dialog
                open={deleteConfirmation.open}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClick={(e) => e.stopPropagation()} // Prevent bubbling clicks to parent
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Conversation?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this conversation? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ChatSidebar;
