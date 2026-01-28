import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper, FormControl, InputLabel, Select, Alert, Stack, Chip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import api from '../../services/api';
import { toast } from 'react-toastify';

const TEMPLATES = {
    pi: [
        { "category": "Kitchen", "marketShare": 15, "competitor": "Brand A", "sov": 12.5 }
    ],
    helium10: [
        { "keyword": "spatula", "searchVolume": 5000, "competition": "high", "trend": "rising" }
    ],
    adsLibrary: [
        { "adId": "123", "brand": "Competitor X", "type": "Sponsored Video", "copy": "Best spatula ever" }
    ]
};

const DatasetUpload = () => {
    const [type, setType] = useState('pi');
    const [category, setCategory] = useState('');
    const [jsonContent, setJsonContent] = useState('');
    const [stats, setStats] = useState(null);

    const handleJsonChange = (e) => {
        const val = e.target.value;
        setJsonContent(val);
        try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
                setStats({ valid: true, count: parsed.length, message: `Valid JSON array with ${parsed.length} items` });
            } else {
                setStats({ valid: true, count: 1, message: 'Valid JSON object' });
            }
        } catch (err) {
            setStats({ valid: false, message: 'Invalid JSON format' });
        }
    };

    const loadTemplate = () => {
        setJsonContent(JSON.stringify(TEMPLATES[type], null, 2));
        setStats({ valid: true, count: 1, message: 'Template loaded' });
    };

    const handleSubmit = async () => {
        try {
            const parsedData = JSON.parse(jsonContent);
            await api.post('/admin/datasets', {
                type,
                category,
                data: parsedData
            });
            toast.success('Dataset uploaded successfully');
            setCategory('');
            setJsonContent('');
            setStats(null);
        } catch (error) {
            toast.error('Failed to upload: ' + error.message);
        }
    };

    return (
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>Upload / Define Dataset</Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Define internal documents or market data for the AI to reference. Paste JSON data below.
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Data Source Type</InputLabel>
                        <Select value={type} label="Data Source Type" onChange={(e) => setType(e.target.value)}>
                            <MenuItem value="pi">Pi Market Intelligence (Share of Voice)</MenuItem>
                            <MenuItem value="helium10">Helium 10 (Keywords)</MenuItem>
                            <MenuItem value="adsLibrary">Amazon Ads Library (Creative)</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Category / Tag"
                        placeholder="e.g. Kitchen, Yoga Mats"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </Stack>

                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2">Data Content (JSON)</Typography>
                    <Button size="small" startIcon={<ContentPasteIcon />} onClick={loadTemplate}>
                        Load Example Template
                    </Button>
                </Box>

                <TextField
                    fullWidth
                    multiline
                    rows={12}
                    value={jsonContent}
                    onChange={handleJsonChange}
                    placeholder="Paste JSON array here..."
                    sx={{ mb: 2, fontFamily: 'monospace' }}
                    error={stats && !stats.valid}
                    helperText={stats ? stats.message : "Paste a JSON array of objects"}
                />

                {stats && stats.valid && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Ready to upload <strong>{stats.count}</strong> record(s).
                    </Alert>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        color="inherit"
                        onClick={() => { setJsonContent(''); setStats(null); }}
                        startIcon={<DeleteSweepIcon />}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleSubmit}
                        disabled={!category || !jsonContent || (stats && !stats.valid)}
                    >
                        Upload Dataset
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default DatasetUpload;
