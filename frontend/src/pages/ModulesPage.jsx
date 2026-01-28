
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Container, Chip, CircularProgress, Card, CardContent, CardActions, CardActionArea } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School'; // Default icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import api from '../services/api';
import { toast } from 'react-toastify';
import ModuleViewer from '../components/Modules/ModuleViewer';

const ModulesPage = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedModule, setSelectedModule] = useState(null);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const res = await api.get('/modules');
            setModules(res.data.data);
        } catch (error) {
            console.error("Failed to fetch modules", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async (id) => {
        try {
            await api.post(`/modules/${id}/complete`);
            toast.success("Module Completed! 🎉");

            // Close viewer if open with this module
            if (selectedModule && selectedModule._id === id) {
                // Update local state without fetch to keep viewer open? 
                // Better to simple close or update the 'completed' status in local state
                setSelectedModule(prev => ({ ...prev, completed: true }));
            }

            fetchModules();
        } catch (error) {
            toast.error("Failed to update progress");
        }
    };

    const handleOpenModule = (module) => {
        setSelectedModule(module);
    };

    const handleCloseModule = () => {
        setSelectedModule(null);
    };

    // Group by Category
    const groupedModules = modules.reduce((acc, mod) => {
        const cat = mod.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(mod);
        return acc;
    }, {});

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h4" component="h1">
                    Learning Modules
                </Typography>
            </Box>

            {Object.entries(groupedModules).map(([category, mods]) => (
                <Box key={category} sx={{ mb: 5 }}>
                    <Typography variant="h5" gutterBottom sx={{ borderBottom: 2, borderColor: 'divider', pb: 1, mb: 3, color: 'text.primary' }}>
                        {category}
                    </Typography>

                    <Grid container spacing={3}>
                        {mods.map((module) => (
                            <Grid item xs={12} md={6} lg={4} key={module._id}>
                                <Card
                                    elevation={2}
                                    sx={{
                                        width: '120mm',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 8
                                        }
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => handleOpenModule(module)}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'stretch',
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1, pb: 1, width: '100%' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Chip
                                                    icon={<AccessTimeIcon />}
                                                    label={`${module.estimatedTime} min`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ borderRadius: 1 }}
                                                />
                                                {module.completed && (
                                                    <Chip
                                                        icon={<CheckCircleIcon />}
                                                        label="Done"
                                                        color="success"
                                                        size="small"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                )}
                                            </Box>

                                            <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                                                {module.title}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                {module.description}
                                            </Typography>
                                        </CardContent>

                                        <Box sx={{ p: 2, pt: 0, width: '100%', mt: 'auto' }}>
                                            <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                                <MenuBookIcon sx={{ fontSize: 16, mr: 0.5 }} /> Read Module
                                            </Typography>
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}

            <ModuleViewer
                module={selectedModule}
                open={Boolean(selectedModule)}
                onClose={handleCloseModule}
                onComplete={handleMarkComplete}
            />
        </Container>
    );
};

export default ModulesPage;
