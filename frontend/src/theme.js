import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#232f3e', // Amazon Dark Blue
        },
        secondary: {
            main: '#ff9900', // Amazon Orange
        },
        background: {
            default: '#f8f9fa'
        }
    },
    typography: {
        fontFamily: '"Amazon Ember", "Helvetica", "Arial", sans-serif',
    }
});

export default theme;
