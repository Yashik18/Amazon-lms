import React from 'react';
import { Grid, Typography } from '@mui/material';
import ScenarioCard from './ScenarioCard';

const ScenarioList = ({ scenarios, onStart }) => {
    if (!scenarios || scenarios.length === 0) {
        return <Typography>No scenarios available.</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {scenarios.map((scenario) => (
                <Grid key={scenario._id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ScenarioCard scenario={scenario} onStart={onStart} />
                </Grid>
            ))}
        </Grid>
    );
};

export default ScenarioList;
