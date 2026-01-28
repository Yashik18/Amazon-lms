import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SchoolIcon from '@mui/icons-material/School';

const StatCard = ({ title, value, subtext, icon, color }) => (
    <Card sx={{ height: '100%', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3, '&:last-child': { pb: 3 } }}>
            <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, mr: 3, width: 64, height: 64 }}>
                {React.cloneElement(icon, { sx: { fontSize: 32 } })}
            </Avatar>
            <Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>{title}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>{value}</Typography>
                {subtext && <Typography variant="caption" color="text.secondary">{subtext}</Typography>}
            </Box>
        </CardContent>
    </Card>
);

const OverviewCards = ({ stats }) => {
    // Default stats if missing
    const s = stats || {
        totalMinutes: 0,
        modulesCompleted: 0,
        workflowsMastered: 0,
        scenariosSolved: 0,
        averageScore: 0,
        currentStreak: 0
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                    title="Time"
                    value={`${Math.round(s.totalMinutes / 60)}h ${s.totalMinutes % 60}m`}
                    icon={<AccessTimeIcon />}
                    color="primary"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                    title="Workflows"
                    value={s.workflowsMastered}
                    icon={<CheckCircleIcon />}
                    color="success"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                    title="Modules"
                    value={s.modulesCompleted}
                    icon={<SchoolIcon />}
                    color="info"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                    title="Scenario Avg"
                    value={`${s.averageScore}%`}
                    icon={<EmojiEventsIcon />}
                    color="warning"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                    title="Streak"
                    value={`${s.currentStreak} Days`}
                    icon={<LocalFireDepartmentIcon />}
                    color="error"
                />
            </Grid>
        </Grid>
    );
};

export default OverviewCards;
