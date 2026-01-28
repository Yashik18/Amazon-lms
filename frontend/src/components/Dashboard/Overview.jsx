import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress, Skeleton, Paper } from '@mui/material';
import api from '../../services/api';
import OverviewCards from './OverviewCards';
import CategoryProgress from './CategoryProgress';
import ActivityFeed from './ActivityFeed';
import Achievements from './Achievements';

const Overview = () => {
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await api.get('/progress');
                setProgressData(res.data.data);
            } catch (error) {
                console.error("Failed to fetch progress", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    if (loading) {
        return (
            <Box sx={{ mt: 2 }}>
                {/* Stats Skeletons */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 2, mb: 3 }}>
                            <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={200} />
                        </Paper>
                        <Paper sx={{ p: 2 }}>
                            <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={150} />
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (!progressData) return <Typography>No data available.</Typography>;

    return (
        <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Box sx={{ mb: 3 }}>
                <OverviewCards stats={progressData?.overview} />
            </Box>

            <Grid container spacing={3} alignItems="stretch">
                <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Left Column */}
                    <Box sx={{ mb: 3 }}>
                        <CategoryProgress breakdown={progressData?.categoryBreakdown} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Achievements achievements={progressData?.achievements} />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Right Column */}
                    <Box sx={{ flexGrow: 1 }}>
                        <ActivityFeed feed={progressData?.activityFeed} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Overview;
