import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import WorkflowList from '../components/Workflows/WorkflowList';
import WorkflowPlayer from '../components/Workflows/WorkflowPlayer';
import api from '../services/api';
import { toast } from 'react-toastify';

const WorkflowsPage = () => {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeWorkflow, setActiveWorkflow] = useState(null);

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const fetchWorkflows = async () => {
        try {
            const res = await api.get('/workflows');
            setWorkflows(res.data.data);
        } catch (error) {
            console.error("Failed to fetch workflows", error);
            toast.error("Failed to load workflows");
        } finally {
            setLoading(false);
        }
    };

    const handleStartWorkflow = (workflow) => {
        setActiveWorkflow(workflow);
    };

    const handleClosePlayer = () => {
        setActiveWorkflow(null);
        fetchWorkflows();
    };

    if (activeWorkflow) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <WorkflowPlayer
                    workflow={activeWorkflow}
                    onClose={handleClosePlayer}
                    onFinish={handleClosePlayer}
                />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Guided Workflows
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Step-by-step playbooks for complex Amazon Seller tasks.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <WorkflowList workflows={workflows} onStart={handleStartWorkflow} />
            )}
        </Container>
    );
};

export default WorkflowsPage;
