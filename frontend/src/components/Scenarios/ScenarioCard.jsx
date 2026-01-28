import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Chip, Box, LinearProgress } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ScenarioCard = ({ scenario, onStart }) => {
    // Correctly accessing difficulty (handle lowercase if needed)
    const difficultyColor = {
        beginner: 'success',
        intermediate: 'warning',
        advanced: 'error'
    }[scenario.difficulty.toLowerCase()] || 'default';

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                        label={scenario.difficulty.toUpperCase()}
                        size="small"
                        color={difficultyColor}
                        variant="outlined"
                    />
                    {scenario.attempted && (
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="caption">Best: {scenario.bestScore}%</Typography>
                        </Box>
                    )}
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                    {scenario.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {scenario.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    startIcon={<QuizIcon />}
                    size="small"
                    onClick={() => onStart(scenario)}
                >
                    {scenario.attempted ? 'Try Again' : 'Start Simulation'}
                </Button>
            </CardActions>
        </Card>
    );
};

export default ScenarioCard;
