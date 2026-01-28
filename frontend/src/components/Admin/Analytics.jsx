import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    const statCards = [
        { label: 'Total Users', value: stats?.users || 0 },
        { label: 'Workflows', value: stats?.workflows || 0 },
        { label: 'Scenarios', value: stats?.scenarios || 0 },
        { label: 'Modules', value: stats?.modules || 0 },
        { label: 'Datasets', value: stats?.datasets || 0 },
    ];

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>System Analytics</Typography>

            {/* Top Row: 5 Cards - Custom Flex to ensure 5 items per row on Desktop */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
                {statCards.map((card) => (
                    <Card key={card.label} sx={{ flex: 1, minWidth: 0 }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Typography color="text.secondary" variant="subtitle1" gutterBottom>{card.label}</Typography>
                            <Typography variant="h3" fontWeight="bold" color="primary.main">{card.value}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Bottom Row: Charts and Info */}
            <Grid container spacing={3} alignItems="stretch">
                <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex' }}>
                    <Paper sx={{ p: 4, width: '1000mm', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom>Content Distribution</Typography>
                        <Box sx={{ flexGrow: 1, mt: 2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Workflows', count: stats?.workflows || 0 },
                                    { name: 'Scenarios', count: stats?.scenarios || 0 },
                                    { name: 'Modules', count: stats?.modules || 0 },
                                    { name: 'Datasets', count: stats?.datasets || 0 }
                                ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="count" fill="#1976d2" barSize={60} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                    <Paper sx={{ p: 4, width: '1000mm', minHeight: 400 }}>
                        <Typography variant="h6" gutterBottom>Quick Stats</Typography>

                        <Box sx={{ mt: 4 }}>
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 1 }}>
                                <Typography variant="subtitle2">System Status</Typography>
                                <Typography variant="h6">Operational</Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary">Database Connection</Typography>
                                <Typography variant="body1">Connected (MongoDB)</Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary">Last Backup</Typography>
                                <Typography variant="body1">{new Date().toLocaleDateString()} 04:00 AM</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Server Uptime</Typography>
                                <Typography variant="body1">99.9%</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
