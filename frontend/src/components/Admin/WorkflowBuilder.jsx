import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';
import { toast } from 'react-toastify';

const WorkflowBuilder = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState([{ title: '', instruction: '', toolReference: '' }]);

    const addStep = () => {
        setSteps([...steps, { title: '', instruction: '', toolReference: '' }]);
    };

    const updateStep = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const removeStep = (index) => {
        const newSteps = steps.filter((_, i) => i !== index);
        setSteps(newSteps);
    };

    const handleSave = async () => {
        try {
            await api.post('/admin/workflows', {
                title,
                description,
                category: 'General', // Field missing in simple form, hardcoded for now
                steps,
                estimatedTime: steps.length * 5
            });
            toast.success('Workflow created!');
            setTitle('');
            setDescription('');
            setSteps([{ title: '', instruction: '', toolReference: '' }]);
        } catch (error) {
            toast.error('Failed to create workflow');
        }
    };

    return (
        <Box maxWidth="md">
            <Typography variant="h6" gutterBottom>Create Workflow</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth multiline rows={2} label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Paper>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Steps</Typography>
            {steps.map((step, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, borderLeft: '4px solid #1976d2' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">Step {index + 1}</Typography>
                        <IconButton size="small" color="error" onClick={() => removeStep(index)}><DeleteIcon /></IconButton>
                    </Box>
                    <TextField
                        fullWidth size="small" label="Step Title"
                        value={step.title} onChange={(e) => updateStep(index, 'title', e.target.value)}
                        sx={{ mb: 1, mt: 1 }}
                    />
                    <TextField
                        fullWidth multiline rows={2} size="small" label="Instruction"
                        value={step.instruction} onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        fullWidth size="small" label="Tool Reference (pi, helium10, adsLibrary)"
                        value={step.toolReference} onChange={(e) => updateStep(index, 'toolReference', e.target.value)}
                    />
                </Paper>
            ))}

            <Button startIcon={<AddIcon />} onClick={addStep} sx={{ mr: 2 }}>Add Step</Button>
            <Divider sx={{ my: 3 }} />
            <Button variant="contained" size="large" onClick={handleSave}>Save Workflow</Button>
        </Box>
    );
};

export default WorkflowBuilder;
