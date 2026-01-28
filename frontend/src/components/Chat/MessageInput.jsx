import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const maxLength = 1000;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                display: 'flex',
                alignItems: 'flex-start'
            }}
        >
            <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask about Amazon selling..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                variant="outlined"
                inputProps={{ maxLength }}
                helperText={`${input.length}/${maxLength}`}
                sx={{ mr: 2 }}
            />
            <Button
                type="submit"
                variant="contained"
                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={!input.trim() || isLoading}
                sx={{ minWidth: '100px', height: '56px' }}
            >
                {isLoading ? 'Sending' : 'Send'}
            </Button>
        </Box>
    );
};

export default MessageInput;
