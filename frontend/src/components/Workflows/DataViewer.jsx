import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import api from '../../services/api';

const DataViewer = ({ dataType, query }) => {
    // In a real app, 'query' might be keywords or category to fetch. 
    // For this MVP, we might fetch all relevant data or filter client-side if data is small,
    // Or fetch specific dataset ID.

    // Assuming 'query' here is effectively the 'category' or 'keywords' we want to look up.
    // But our seed data is structured by Type -> Category.
    // We'll simulate fetching relevant data.

    const [data, setData] = useState([]);

    useEffect(() => {
        // Mock fetching for now or use real API if we had a "search dataset" endpoint.
        // We only have 'POST /admin/datasets' and seeded data in DB.
        // Let's assume we fetch all datasets of type and filter (inefficient but works for MVP).
        // Actually, let's just mock the display structure assuming data is passed prop or fetched content.

        // BETTER APPROACH: The 'StepContent' passes the actual data object.
        // If 'dataType' is provided, we expect 'data' prop to contain the rows.

        // Since we don't have a direct "Get Helium10 Data for 'spatula'" endpoint ready without AI service,
        // we will rely on the AI/Workflow Step providing sample data or we fetch a hardcoded set.

        // For MVP visualization, let's display some static mock data if none provided, 
        // to demonstrate the UI component capabilities.
    }, [dataType]);


    const renderHelium10 = () => (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                        <TableCell>Keyword</TableCell>
                        <TableCell align="right">Search Volume</TableCell>
                        <TableCell align="right">Trend</TableCell>
                        <TableCell align="right">CPR</TableCell>
                        <TableCell align="right">Competitors</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Mock Data Row */}
                    <TableRow>
                        <TableCell component="th" scope="row">silicone spatula set</TableCell>
                        <TableCell align="right">45,000</TableCell>
                        <TableCell align="right"><Chip icon={<TrendingUpIcon />} label="+12%" size="small" color="success" variant="outlined" /></TableCell>
                        <TableCell align="right">80</TableCell>
                        <TableCell align="right">High</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row">heat resistant spatula</TableCell>
                        <TableCell align="right">12,000</TableCell>
                        <TableCell align="right"><Chip icon={<TrendingDownIcon />} label="-5%" size="small" color="error" variant="outlined" /></TableCell>
                        <TableCell align="right">30</TableCell>
                        <TableCell align="right">Med</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderPi = () => (
        <Box>
            <Typography variant="subtitle2" gutterBottom>Share of Voice Leaders</Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                            <TableCell>Brand</TableCell>
                            <TableCell align="right">SOV %</TableCell>
                            <TableCell align="right">Rank</TableCell>
                            <TableCell align="right">Trend</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>OXO Good Grips</TableCell>
                            <TableCell align="right">22.1%</TableCell>
                            <TableCell align="right">#1</TableCell>
                            <TableCell align="right">Steady</TableCell>
                        </TableRow>
                        <TableRow selected>
                            <TableCell>YourBrand</TableCell>
                            <TableCell align="right">12.5%</TableCell>
                            <TableCell align="right">#8</TableCell>
                            <TableCell align="right">Down</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderAds = () => (
        <Box>
            {['Sponsored Brand', 'Sponsored Product'].map((type, i) => (
                <Accordion key={i} defaultExpanded={i === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{type}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Paper sx={{ p: 2, border: '1px solid #eee', width: '100%' }}>
                                <Typography variant="caption" color="text.secondary">Competitor: OXO</Typography>
                                <Typography variant="body1" fontWeight="bold">Premium Quality Utensils</Typography>
                                <Typography variant="body2">Top rated ergonomic designs for every kitchen.</Typography>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Chip label="Top of Search" size="small" />
                                    <Chip label="$500/day" size="small" color="primary" variant="outlined" />
                                </Box>
                            </Paper>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );

    return (
        <Box sx={{ mt: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
            {dataType && dataType !== 'none' && (
                <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
                    {dataType.toUpperCase()} DATA PREVIEW
                </Typography>
            )}

            {dataType === 'helium10' && renderHelium10()}
            {dataType === 'pi' && renderPi()}
            {dataType === 'adsLibrary' && renderAds()}
            {(!dataType || dataType === 'none') && (
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        ℹ️ This step focuses on strategy and decision making. No external data tools are needed here.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default DataViewer;
