import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Simple Login and Register combined page for MVP
const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let userFn = isLogin ? login : register;

        const userData = isLogin
            ? await login(email, password)
            : await register(name, email, password);

        if (userData) {
            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    {isLogin ? 'Sign in to Amazon LMS' : 'Create Account'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    {!isLogin && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Full Name"
                            autoFocus={!isLogin}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        autoFocus={isLogin}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                    <Box textAlign="center">
                        <Link component="button" variant="body2" onClick={() => setIsLogin(!isLogin)} type="button">
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
