
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ModuleViewer = ({ module, open, onClose, onComplete }) => {
    if (!module) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6">{module.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {module.category} • {module.estimatedTime} min read
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{
                    typography: 'body1',
                    '& h1': { fontSize: '1.8rem', mb: 2, borderBottom: '1px solid #eee', pb: 1 },
                    '& h2': { fontSize: '1.4rem', mt: 3, mb: 2, color: 'primary.main' },
                    '& h3': { fontSize: '1.1rem', mt: 2, mb: 1, fontWeight: 'bold' },
                    '& p': { mb: 2, lineHeight: 1.7 },
                    '& ul, & ol': { mb: 2, pl: 3 },
                    '& li': { mb: 1 },
                    '& strong': { color: 'text.primary' },
                }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {module.content || "_No content available._"}
                    </ReactMarkdown>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        onComplete(module._id);
                    }}
                    disabled={module.completed}
                >
                    {module.completed ? "Completed" : "Mark as Complete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModuleViewer;
