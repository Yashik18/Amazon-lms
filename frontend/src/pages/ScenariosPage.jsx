import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import ScenarioList from '../components/Scenarios/ScenarioList';
import ScenarioPlayer from '../components/Scenarios/ScenarioPlayer';
import api from '../services/api';
import { toast } from 'react-toastify';

const ScenariosPage = () => {
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeScenario, setActiveScenario] = useState(null);

    useEffect(() => {
        fetchScenarios();
    }, []);

    const fetchScenarios = async () => {
        try {
            const res = await api.get('/scenarios');
            setScenarios(res.data.data);
        } catch (error) {
            console.error("Failed to fetch scenarios", error);
            toast.error("Failed to load scenarios");
        } finally {
            setLoading(false);
        }
    };

    const handleStart = (scenario) => {
        setActiveScenario(scenario);
    };

    const handleClose = () => {
        setActiveScenario(null);
        fetchScenarios(); // Refresh to update "attempted" status/scores
    };

    if (activeScenario) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, height: '85vh' }}>
                <ScenarioPlayer
                    scenario={activeScenario}
                    onClose={handleClose}
                />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Real-World Scenarios
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Test your Amazon Seller skills in high-pressure simulations.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <ScenarioList scenarios={scenarios} onStart={handleStart} />
            )}
        </Container>
    );
};

export default ScenariosPage;
