import React from 'react';
import { Container, Typography } from '@mui/material';
import AdminDashboard from '../components/Admin/AdminDashboard';

const AdminPage = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Admin Portal</Typography>
            <AdminDashboard />
        </Container>
    );
};

export default AdminPage;
