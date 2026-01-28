import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, useTheme, useMediaQuery, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/');
    };

    const navItems = [
        { label: 'Chat', path: '/chat' },
        { label: 'Workflows', path: '/workflows' },
        { label: 'Scenarios', path: '/scenarios' },
        { label: 'Modules', path: '/modules' },
        { label: 'Dashboard', path: '/dashboard' },
    ];

    if (isAdmin) {
        navItems.push({ label: 'Admin', path: '/admin' });
    }

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Desktop LOGO */}
                    <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={NavLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        AmazonLMS
                    </Typography>

                    {/* Mobile Menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={(e) => setAnchorElNav(e.currentTarget)}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={() => setAnchorElNav(null)}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {isAuthenticated && navItems.map((item) => (
                                <MenuItem key={item.label} onClick={() => {
                                    setAnchorElNav(null);
                                    navigate(item.path);
                                }}>
                                    <Typography textAlign="center">{item.label}</Typography>
                                </MenuItem>
                            ))}
                            {!isAuthenticated && (
                                <MenuItem onClick={() => {
                                    setAnchorElNav(null);
                                    navigate('/login');
                                }}>
                                    <Typography textAlign="center">Login</Typography>
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>

                    {/* Mobile LOGO */}
                    <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LMS
                    </Typography>

                    {/* Desktop Nav */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {isAuthenticated && navItems.map((item) => (
                            <Button
                                key={item.label}
                                component={NavLink}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                sx={{
                                    my: 2,
                                    color: 'text.primary',
                                    display: 'block',
                                    '&.active': { color: 'primary.main', fontWeight: 'bold' }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    {/* User Menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        {isAuthenticated ? (
                            <>
                                <IconButton
                                    size="large"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem disabled>{user?.name}</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button color="inherit" component={NavLink} to="/login">Login</Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
