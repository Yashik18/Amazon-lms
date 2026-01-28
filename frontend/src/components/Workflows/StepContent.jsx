import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Divider, Alert, CircularProgress } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DataViewer from './DataViewer';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'react-toastify';

const StepContent = ({ step, inputValue, onInputChange, onComplete, isValid }) => {
    // const [actionInput, setActionInput] = useState(''); // Lifted up
    const [hint, setHint] = useState(null);
    const [loadingHint, setLoadingHint] = useState(false);

    // Effect to clear hint when step changes is handled by parent unmounting/remounting or we can add effect
    // But StepContent is re-rendered with new step prop? Yes.
    // Ideally we should reset hint when step changes.
    React.useEffect(() => {
        setHint(null);
    }, [step]);

    const handleAskHint = async () => {
        setLoadingHint(true);
        setHint(null);
        try {
            const res = await api.post('/workflows/hint', {
                stepTitle: step.title,
                stepInstruction: step.instruction
            });
            setHint(res.data.hint);
        } catch (error) {
            console.error("Hint failed", error);
            toast.error("Could not get hint from AI");
        } finally {
            setLoadingHint(false);
        }
    };

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>{step.title}</Typography>
            <Typography variant="body1" paragraph>
                {step.instruction}
            </Typography>

            <DataViewer dataType={step.toolReference} />

            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Action Required: {step.expectedAction}
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={step.expectedAction.toLowerCase().includes('score') ? "Enter score (number only)..." : "Enter your notes or results here..."}
                    size="small"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    error={inputValue && !isValid} // Show error state if input exists but is invalid (e.g. NaN)
                    helperText={inputValue && !isValid ? "Please enter a valid number" : ""}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        startIcon={loadingHint ? <CircularProgress size={20} /> : <SmartToyIcon />}
                        variant="text"
                        size="small"
                        color="secondary"
                        onClick={handleAskHint}
                        disabled={loadingHint}
                    >
                        {loadingHint ? 'Thinking...' : 'Ask AI for Hint'}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={onComplete}
                        disabled={!isValid}
                    >
                        Complete Step
                    </Button>
                </Box>

                {hint && (
                    <Alert severity="info" sx={{ mt: 2 }} onClose={() => setHint(null)}>
                        <Box sx={{
                            '& p': { m: 0, mb: 1 },
                            '& ul, & ol': { m: 0, mb: 1, pl: 2 },
                            '& table': { width: '100%', borderCollapse: 'collapse', mb: 1 },
                            '& th, & td': { border: '1px solid #ccc', p: 0.5 }
                        }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{hint}</ReactMarkdown>
                        </Box>
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default StepContent;
