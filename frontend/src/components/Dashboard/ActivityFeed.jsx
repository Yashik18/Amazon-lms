import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider, Chip } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment'; // Workflow
import QuizIcon from '@mui/icons-material/Quiz'; // Scenario
import SchoolIcon from '@mui/icons-material/School'; // Module
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Achievement

const ActivityFeed = ({ feed }) => {
    const activities = feed || [];

    const getIcon = (type) => {
        switch (type) {
            case 'workflow': return <AssignmentIcon />;
            case 'scenario': return <QuizIcon />;
            case 'achievement': return <EmojiEventsIcon />;
            default: return <SchoolIcon />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'workflow': return 'secondary.main';
            case 'scenario': return 'warning.main';
            case 'achievement': return 'success.main';
            default: return 'primary.main';
        }
    };

    if (activities.length === 0) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                    <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
                </CardContent>
            </Card>
        );
    }

    // Use timeago or date-fns in real app, simply formatting date now
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                <List dense>
                    {activities.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'transparent', color: getColor(item.type), border: `1px solid` }}>
                                        {getIcon(item.type)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.description}
                                    secondary={new Date(item.timestamp).toLocaleDateString() + ' ' + new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                />
                            </ListItem>
                            {index < activities.length - 1 && <Divider component="li" variant="inset" />}
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default ActivityFeed;
