import React, { useState, useRef } from 'react';
import { Box, TextField, Button, CircularProgress, IconButton, Chip, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart'; // Excel Icon
import api from '../../services/api'; // Import API for uploads
import { toast } from 'react-toastify';

const MessageInput = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const [attachments, setAttachments] = useState([]); // Array of uploaded file metadata
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const maxLength = 2000; // Increased length for detailed questions

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((input.trim() || attachments.length > 0) && !isLoading && !isUploading) {
            onSend(input, attachments); // Pass attachments to parent
            setInput('');
            setAttachments([]); // Clear attachments after send
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const uploadFile = async (file) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be under 5MB");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                const newAttachment = {
                    fileUrl: res.data.data.url,
                    localPath: res.data.data.localPath,
                    originalName: res.data.data.originalName,
                    mimeType: res.data.data.mimeType,
                    fileType: file.type.startsWith('image/') ? 'image' : 'file'
                };
                setAttachments(prev => [...prev, newAttachment]);
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset input immediately
        e.target.value = '';
        await uploadFile(file);
    };

    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    e.preventDefault(); // Prevent pasting the binary string
                    const namedFile = new File([file], `screenshot-${Date.now()}.png`, { type: file.type });
                    uploadFile(namedFile);
                }
            }
        }
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const getIconForType = (mimeType) => {
        if (mimeType.startsWith('image/')) return <ImageIcon fontSize="small" />;
        if (mimeType === 'application/pdf') return <PictureAsPdfIcon fontSize="small" />;
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <TableChartIcon fontSize="small" />;
        return <InsertDriveFileIcon fontSize="small" />;
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
                alignItems: 'flex-start',
                flexDirection: 'column'
            }}
        >
            {/* Attachments Preview Area */}
            {attachments.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, width: '100%' }}>
                    {attachments.map((file, index) => (
                        <Chip
                            key={index}
                            icon={getIconForType(file.mimeType)}
                            label={file.originalName.length > 20 ? file.originalName.substring(0, 18) + '...' : file.originalName}
                            onDelete={() => removeAttachment(index)}
                            variant="outlined"
                            size="small"
                        />
                    ))}
                </Box>
            )}

            <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-end' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept=".jpg,.jpeg,.png,.pdf,.docx,.xlsx,.xls"
                />

                <TextField
                    fullWidth
                    placeholder={attachments.length > 0 ? "Add a message..." : "Ask questions, paste screenshots, or attach files..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    disabled={isLoading || isUploading}
                    variant="outlined"
                    size="small"
                    multiline
                    maxRows={4}
                    sx={{
                        mr: 1,
                        '& .MuiOutlinedInput-root': {
                            paddingLeft: 1 // Adjust padding for adornment
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <IconButton
                                color="primary"
                                onClick={() => fileInputRef.current.click()}
                                disabled={isLoading || isUploading}
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                {isUploading ? <CircularProgress size={20} /> : <AttachFileIcon />}
                            </IconButton>
                        ),
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    disabled={(!input.trim() && attachments.length === 0) || isLoading || isUploading}
                    sx={{ minWidth: '80px', height: '40px', mb: 0.5 }}
                >
                    Send
                </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                Supports JPG, PNG, PDF, DOCX, XLSX (Max 5MB)
            </Typography>
        </Box>
    );
};

export default MessageInput;
