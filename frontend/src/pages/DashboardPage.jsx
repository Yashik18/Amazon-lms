import React from 'react';
import { Container } from '@mui/material';
import Overview from '../components/Dashboard/Overview';

const DashboardPage = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Overview />
        </Container>
    );
};

export default DashboardPage;
