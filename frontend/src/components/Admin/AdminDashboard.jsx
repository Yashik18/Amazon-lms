import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Analytics from './Analytics';
import DatasetUpload from './DatasetUpload';
import WorkflowBuilder from './WorkflowBuilder';
import ScenarioCreator from './ScenarioCreator';
import ModuleCreator from './ModuleCreator';
import LoadingScreen from '../common/LoadingScreen';

const AdminDashboard = () => {
    const [value, setValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event, newValue) => {
        setIsLoading(true);
        setTimeout(() => {
            setValue(newValue);
            setIsLoading(false);
        }, 500);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
                    <Tab label="Analytics" />
                    <Tab label="Datasets" />
                    <Tab label="Workflows" />
                    <Tab label="Scenarios" />
                    <Tab label="Modules" />
                </Tabs>
            </Box>

            {isLoading ? (
                <LoadingScreen height="400px" />
            ) : (
                <Box sx={{ animation: 'fadeIn 0.5s' }}>
                    {value === 0 && <Analytics />}
                    {value === 1 && <DatasetUpload />}
                    {value === 2 && <WorkflowBuilder />}
                    {value === 3 && <ScenarioCreator />}
                    {value === 4 && <ModuleCreator />}
                </Box>
            )}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </Box>
    );
};

export default AdminDashboard;
