import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingScreen = ({ height = '80vh', size = 60 }) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: height,
            width: '100%',
            animation: 'fadeIn 0.3s'
        }}>
            <CircularProgress size={size} />
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </Box>
    );
};

export default LoadingScreen;
