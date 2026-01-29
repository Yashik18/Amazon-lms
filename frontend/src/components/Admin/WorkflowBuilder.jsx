import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider, IconButton, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';
import { toast } from 'react-toastify';

const WorkflowBuilder = () => {
    const [workflows, setWorkflows] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState([{ title: '', instruction: '', toolReference: '' }]);

    // Delete Modal State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [workflowToDelete, setWorkflowToDelete] = useState(null);

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const fetchWorkflows = async () => {
        try {
            const res = await api.get('/workflows');
            setWorkflows(res.data.data);
        } catch (error) {
            console.error("Failed to fetch workflows", error);
        }
    };

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
            fetchWorkflows();
        } catch (error) {
            toast.error('Failed to create workflow');
        }
    };

    const handleDelete = (id) => {
        setWorkflowToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!workflowToDelete) return;
        try {
            await api.delete(`/workflows/${workflowToDelete}`);
            toast.success('Workflow deleted');
            fetchWorkflows();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete workflow');
        } finally {
            setDeleteDialogOpen(false);
            setWorkflowToDelete(null);
        }
    };

    return (
        <Box maxWidth="xl" sx={{ display: 'grid', gridTemplateColumns: { lg: '1fr 1fr' }, gap: 4 }}>
            <Box>
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

            <Box>
                <Typography variant="h6" gutterBottom>Existing Workflows</Typography>
                <Paper sx={{ maxHeight: '80vh', overflow: 'auto' }}>
                    <List>
                        {workflows.map((wf, index) => (
                            <React.Fragment key={wf._id}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(wf._id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={wf.title}
                                        secondary={`${wf.steps.length} steps • ${wf.estimatedTime} mins`}
                                    />
                                </ListItem>
                                {index < workflows.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                        {workflows.length === 0 && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography color="text.secondary">No workflows found</Typography>
                            </Box>
                        )}
                    </List>
                </Paper>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Workflow?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this workflow? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WorkflowBuilder;
