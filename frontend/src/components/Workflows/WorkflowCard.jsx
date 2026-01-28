import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Chip, Box, LinearProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const WorkflowCard = ({ workflow, onStart }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip label={workflow.category} size="small" color="primary" variant="outlined" />
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">{workflow.estimatedTime} min</Typography>
                    </Box>
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                    {workflow.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {workflow.description}
                </Typography>
            </CardContent>
            <Box sx={{ px: 2, pb: 1 }}>
                <Typography variant="caption" display="block">{workflow.progressPercent || 0}% Complete</Typography>
                <LinearProgress variant="determinate" value={workflow.progressPercent || 0} sx={{ mt: 0.5, mb: 1 }} />
            </Box>
            <CardActions>
                <Button size="small" onClick={() => onStart(workflow)}>Start Workflow</Button>
            </CardActions>
        </Card>
    );
};

export default WorkflowCard;
