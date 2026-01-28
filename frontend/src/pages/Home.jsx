import React from 'react';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';

const FeatureCard = ({ icon, title, description }) => (
    <Paper
        sx={{
            p: 3,
            height: '100%',
            width: '3000mm',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' }
        }}
        elevation={3}
    >
        <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Paper>
);

const Home = () => {
    const navigate = useNavigate();

    return (
        <Box>
            {/* Hero Section */}
            <Box sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', py: 8, mb: 6 }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                        Master Amazon Selling with Amazon LMS
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                        Interactive Workflows, Real-world Scenarios, Learning Modules and a smart chatbot powered by global market data.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={{ px: 4, py: 1.5, fontSize: '1.2rem', fontWeight: 'bold' }}
                        onClick={() => navigate('/dashboard')}
                    >
                        Get Started
                    </Button>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Grid container spacing={4} alignItems="stretch" justifyContent="center">
                    <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                        <FeatureCard
                            icon={<SmartToyIcon fontSize="large" />}
                            title="Smart Chatbot"
                            description="Chat with an expert AI trained on market intelligence data. Get instant answers to complex SEO and PPC questions."
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                        <FeatureCard
                            icon={<BarChartIcon fontSize="large" />}
                            title="Guided Workflows"
                            description="Step-by-step interactive playbooks for launching products, optimizing listings, and managing ad campaigns."
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                        <FeatureCard
                            icon={<SchoolIcon fontSize="large" />}
                            title="Real Scenarios"
                            description="Test your skills in high-pressure simulations using real Helium 10 and Pi Datametrics snapshots."
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* Stats / Proof (Mock) */}
            <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} textAlign="center" alignItems='center' justifyContent='center'>
                        <Grid item xs={4}>
                            <Typography variant="h3" color="primary.main" fontWeight="bold">10+</Typography>
                            <Typography variant="subtitle1">Training Modules</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="h3" color="primary.main" fontWeight="bold">24/7</Typography>
                            <Typography variant="subtitle1">Chat Service</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="h3" color="primary.main" fontWeight="bold">100%</Typography>
                            <Typography variant="subtitle1">Data Driven</Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
