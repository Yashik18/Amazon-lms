import React from 'react';
import { Grid, Typography } from '@mui/material';
import WorkflowCard from './WorkflowCard';

const WorkflowList = ({ workflows, onStart }) => {
    if (!workflows || workflows.length === 0) {
        return <Typography>No workflows found.</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {workflows.map((wf) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={wf._id}>
                    <WorkflowCard workflow={wf} onStart={onStart} />
                </Grid>
            ))}
        </Grid>
    );
};

export default WorkflowList;
