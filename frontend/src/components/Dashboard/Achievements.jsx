import React from 'react';
import { Card, CardContent, Typography, Grid, Tooltip, Avatar } from '@mui/material';

const Achievements = ({ achievements }) => {
    const list = achievements?.all || [];
    const earned = achievements?.earned || [];
    const earnedIds = earned.map(a => a.id);

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Achievements</Typography>
                <Grid container spacing={1}>
                    {list.map((badge) => {
                        const isEarned = earnedIds.includes(badge.id);
                        return (
                            <Grid item key={badge.id}>
                                <Tooltip title={`${badge.title}: ${badge.description}`} arrow>
                                    <Avatar
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: isEarned ? 'gold' : 'grey.200',
                                            color: isEarned ? 'black' : 'grey.500',
                                            fontSize: 24,
                                            cursor: 'pointer',
                                            filter: isEarned ? 'none' : 'grayscale(100%)',
                                            border: isEarned ? '2px solid orange' : 'none'
                                        }}
                                    >
                                        {badge.icon}
                                    </Avatar>
                                </Tooltip>
                            </Grid>
                        );
                    })}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Achievements;
