import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

const CategoryProgress = ({ breakdown }) => {
    const categories = breakdown || {
        "Keyword Research": 0,
        "PPC": 0,
        "Listing": 0
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Skills Breakdown</Typography>
                {Object.entries(categories).map(([cat, percent]) => (
                    <Box key={cat} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">{cat}</Typography>
                            <Typography variant="caption">{percent}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={percent} sx={{ height: 6, borderRadius: 3 }} />
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
};

export default CategoryProgress;
