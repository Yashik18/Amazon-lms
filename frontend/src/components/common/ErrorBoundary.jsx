import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
                    <Paper elevation={3} sx={{ p: 5 }}>
                        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h4" gutterBottom color="error">
                            Oops! Something went wrong.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {this.state.error && this.state.error.toString()}
                        </Typography>
                        <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                            We're sorry for the inconvenience. Please try refreshing the page.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleReset}
                        >
                            Refresh Page
                        </Button>
                    </Paper>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
