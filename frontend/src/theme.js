import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#E30613', // Modern Vibrant Red for "Weapon" brand
            dark: '#B2050F',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#1A1A1A', // Sophisticated Black
        },
        background: {
            default: '#FDFDFD',
            paper: '#ffffff',
        },
        text: {
            primary: '#121212',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: '"Inter", "Poppins", "Roboto", sans-serif',
        h1: { fontWeight: 800, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.01em' },
        h5: { fontWeight: 600 },
        button: {
            textTransform: 'none', // Modern apps avoid all-caps for a cleaner look
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12, // Softer corners across the app
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0,0,0,0.02)',
        '0px 4px 12px rgba(0,0,0,0.05)',
        '0px 8px 24px rgba(0,0,0,0.08)',
        '0px 16px 32px rgba(0,0,0,0.12)',
        // ... rest follow MUI defaults
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 8px 16px rgba(227, 6, 19, 0.2)',
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '1px solid #F0F0F0',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 12px 24px rgba(0,0,0,0.08)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    color: '#1A1A1A',
                    boxShadow: 'none',
                    borderBottom: '1px solid #F0F0F0',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        '&:hover fieldset': {
                            borderColor: '#E30613',
                        },
                    },
                },
            },
        },
    },
});

export default theme;