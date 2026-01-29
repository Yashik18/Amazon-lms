import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText, IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ModuleCreator = () => {
    const [modules, setModules] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [content, setContent] = useState('');
    const [estimatedTime, setEstimatedTime] = useState(15);
    const [order, setOrder] = useState(0);

    // Delete Modal State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);

    const categories = ['General', 'PPC', 'Launch', 'Inventory', 'Listing Optimization', 'Account Management'];

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const res = await api.get('/modules');
            setModules(res.data.data);
        } catch (error) {
            console.error("Failed to fetch modules", error);
        }
    };

    const handleSave = async () => {
        try {
            if (!title || !description || !content) {
                toast.error("Title, Description, and Content are required");
                return;
            }

            await api.post('/modules', {
                title,
                description,
                category,
                content,
                estimatedTime: Number(estimatedTime),
                order: Number(order)
            });

            toast.success('Module created successfully');
            fetchModules();
            // Reset form
            setTitle('');
            setDescription('');
            setContent('');
            setEstimatedTime(15);
            setOrder(modules.length + 1);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create module');
        }
    };

    const handleDelete = (id) => {
        setModuleToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!moduleToDelete) return;
        try {
            await api.delete(`/modules/${moduleToDelete}`);
            toast.success('Module deleted');
            fetchModules();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete module');
        } finally {
            setDeleteDialogOpen(false);
            setModuleToDelete(null);
        }
    };

    return (
        <Box maxWidth="lg">
            <Typography variant="h5" gutterBottom>Module Management</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 4 }}>
                {/* Creator Form */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">Create New Module</Typography>

                    <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Est. Time (mins)"
                            value={estimatedTime}
                            onChange={(e) => setEstimatedTime(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            type="number"
                            label="Order"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                        />
                    </Box>

                    <TextField fullWidth multiline rows={2} label="Short Description" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />

                    <TextField
                        fullWidth
                        multiline
                        rows={10}
                        label="Content (Markdown supported)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="# Module Header\n\nContent goes here..."
                        sx={{ mb: 2, fontFamily: 'monospace' }}
                    />

                    <Button variant="contained" fullWidth onClick={handleSave}>Create Module</Button>
                </Paper>

                {/* List of Existing Modules */}
                <Paper sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
                    <Typography variant="h6" gutterBottom color="primary">Existing Modules ({modules.length})</Typography>
                    <List>
                        {modules.map((mod, index) => (
                            <React.Fragment key={mod._id}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(mod._id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="bold">#{mod.order}</Typography>
                                                <Typography variant="body1">{mod.title}</Typography>
                                                <Typography variant="caption" sx={{ bgcolor: 'action.selected', px: 1, borderRadius: 1 }}>{mod.category}</Typography>
                                            </Box>
                                        }
                                        secondary={mod.description}
                                    />
                                </ListItem>
                                {index < modules.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                        {modules.length === 0 && (
                            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>No modules found.</Typography>
                        )}
                    </List>
                </Paper>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Module?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this module? This action cannot be undone.
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

export default ModuleCreator;
