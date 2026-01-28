import React from 'react';
import { Box, Typography, Button, Paper, Alert, Divider } from '@mui/material';
import Confetti from 'react-confetti';

const FeedbackPanel = ({ result, onRetry, onExit }) => {
    const isSuccess = result.score >= 70; // Adjusted threshold to match AI prompt
    console.log("FeedbackPanel received result:", result);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {isSuccess && <Confetti recycle={false} numberOfPieces={500} />}

            <Typography variant="h4" gutterBottom align="center" sx={{ mt: 2 }}>
                {isSuccess ? 'Excellent!' : 'Evaluation Complete'}
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: isSuccess ? 'success.light' : 'background.paper' }}>
                <Typography variant="h2" color={isSuccess ? 'white' : 'text.primary'}>
                    {result.score}/100
                </Typography>
                <Typography variant="subtitle1" color={isSuccess ? 'white' : 'text.secondary'}>
                    {result.feedback}
                </Typography>
            </Paper>

            <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Analysis</Typography>
                <Alert severity={isSuccess ? "success" : "info"} sx={{ mb: 2 }}>
                    {result.explanation}
                </Alert>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>Correct Approach:</Typography>
                <Typography variant="body2" paragraph>
                    {result.correctOption && result.correctOption.explanation}
                </Typography>
            </Box>

            <Box sx={{ mt: 'auto', p: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="outlined" onClick={onRetry}>Try Again</Button>
                <Button variant="contained" onClick={onExit}>Return to List</Button>
            </Box>
        </Box>
    );
};

export default FeedbackPanel;
