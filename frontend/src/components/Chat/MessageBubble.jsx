import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TypewriterEffect from './TypewriterEffect';
import { format } from 'date-fns';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const BASE_URL = API_URL.replace('/api/v1', ''); // Get base for static files

const MessageBubble = ({ role, content, timestamp, isNew, attachments, onTypingComplete, onTyping }) => {
    const isUser = role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                mb: 2,
            }}
        >
            {!isUser && (
                <Box sx={{ mr: 1, mt: 1 }}>
                    <SmartToyIcon color="primary" />
                </Box>
            )}

            <Box sx={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>

                {/* Attachment Previews */}
                {attachments && attachments.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                        {attachments.map((file, idx) => (
                            <Paper key={idx} variant="outlined" sx={{ p: 0.5, display: 'flex', alignItems: 'center', backgroundColor: 'background.paper' }}>
                                {file.mimeType.startsWith('image/') ? (
                                    <Box
                                        component="img"
                                        src={file.fileUrl.startsWith('http') ? file.fileUrl : `${BASE_URL}${file.fileUrl}`}
                                        alt={file.originalName}
                                        sx={{ maxWidth: 200, maxHeight: 200, borderRadius: 1 }}
                                    />
                                ) : (
                                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="caption" sx={{ mr: 1 }}>{file.originalName}</Typography>
                                    </Box>
                                )}
                            </Paper>
                        ))}
                    </Box>
                )}

                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        backgroundColor: isUser ? 'primary.main' : 'background.paper',
                        color: isUser ? 'primary.contrastText' : 'text.primary',
                        borderRadius: 2,
                        position: 'relative'
                    }}
                >
                    {isUser ? (
                        <Typography variant="body1">{content}</Typography>
                    ) : (
                        <Box sx={{ '& p': { m: 0, mb: 1 }, '&:last-child p': { mb: 0 }, '& table': { borderCollapse: 'collapse', width: '100%' }, '& th, & td': { border: '1px solid #ddd', padding: '8px' } }}>
                            <Box sx={{ '& p': { m: 0, mb: 1 }, '&:last-child p': { mb: 0 }, '& table': { borderCollapse: 'collapse', width: '100%' }, '& th, & td': { border: '1px solid #ddd', padding: '8px' } }}>
                                {isNew ? (
                                    <TypewriterEffect content={content} onComplete={onTypingComplete} onTyping={onTyping} />
                                ) : (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                )}
                            </Box>
                        </Box>
                    )}
                </Paper>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        {format(new Date(timestamp), 'h:mm a')}
                    </Typography>
                    {!isUser && (
                        <Tooltip title={copied ? "Copied!" : "Copy"}>
                            <IconButton size="small" onClick={handleCopy}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>

            {isUser && (
                <Box sx={{ ml: 1, mt: 1 }}>
                    <PersonIcon color="action" />
                </Box>
            )}
        </Box>
    );
};

export default MessageBubble;
