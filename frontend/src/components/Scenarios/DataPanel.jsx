import React from 'react';
import { Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const DataPanel = ({ context }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Safety check if context is formatted differently or empty
    if (!context) return null;

    return (
        <Paper elevation={2} sx={{ mb: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="market data tabs">
                    <Tab label="Situation" />
                    <Tab label="Data Snapshot" />
                    {/* Could add specific tabs for Pi, Helium10 if structured data existed */}
                </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
                {value === 0 && (
                    <Box>
                        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>{context.situation}</Typography>
                        {/* If there's an internalAudit or extra text field in the context situation block */}
                        {Object.keys(context).map(key => {
                            if (key !== 'situation' && key !== 'marketData' && key !== 'internalAudit' && key !== 'metrics' && typeof context[key] === 'string') {
                                return (
                                    <Typography key={key} variant="body2" sx={{ mt: 1 }}>
                                        <strong>{key}:</strong> {context[key]}
                                    </Typography>
                                );
                            }
                            return null;
                        })}
                    </Box>
                )}

                {/* Dynamically render the second tab based on what data object exists */}
                {value === 1 && (
                    <Box>
                        {(() => {
                            // Find the data object (marketData, internalAudit, metrics, etc)
                            const dataKey = Object.keys(context).find(k => typeof context[k] === 'object' && k !== 'situation');
                            const dataObj = context[dataKey] || {};

                            if (Object.keys(dataObj).length === 0) {
                                return <Typography color="text.secondary">No data snapshot available.</Typography>;
                            }

                            return (
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Metric</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries(dataObj).map(([k, v]) => (
                                                <TableRow key={k}>
                                                    <TableCell component="th" scope="row">{k}</TableCell>
                                                    <TableCell>{v}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            );
                        })()}
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default DataPanel;
