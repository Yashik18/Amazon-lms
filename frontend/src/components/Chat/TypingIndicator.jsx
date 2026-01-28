import React from 'react';
import { Box, Typography } from '@mui/material';

const TypingIndicator = () => {
    return (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                AI is typing...
            </Typography>
        </Box>
    );
};

export default TypingIndicator;
