import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TypewriterEffect from './TypewriterEffect';
import { format } from 'date-fns';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const MessageBubble = ({ role, content, timestamp, isNew }) => {
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
                                    <TypewriterEffect content={content} />
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
