import React, { useState, useEffect } from 'react';
import {
    Box, Stepper, Step, StepLabel, Button, Typography, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import StepContent from './StepContent';
import api from '../../services/api';
import { toast } from 'react-toastify';

const WorkflowPlayer = ({ workflow, onClose, onFinish }) => {
    // Initialize activeStep from props if available, ensure it's within bounds
    // If completed, we want to start from 0 to review, otherwise continue where left off
    const [activeStep, setActiveStep] = useState(
        (workflow.completed || workflow.progressPercent === 100)
            ? 0
            : Math.min(workflow.currentStep || 0, (workflow.steps?.length || 1) - 1)
    );
    const [completedSteps, setCompletedSteps] = useState({});
    const [stepInput, setStepInput] = useState('');

    // Fetch full details (history) on mount
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await api.get(`/workflows/${workflow._id}`);
                const fullData = res.data.data;
                const history = fullData.userProgress?.stepHistory || [];

                const historyMap = {};
                history.forEach(h => {
                    historyMap[h.step] = h.input;
                });
                console.log("[DEBUG] Hydrated History Map:", historyMap);
                console.log("[DEBUG] Current Active Step:", activeStep);
                setCompletedSteps(historyMap);

                // If we just loaded and found it's completed, ensure we are at 0? 
                // Already handled in useState init if props were correct.
                // But just in case props were stale:
                if (fullData.userProgress?.completed && activeStep === (workflow.steps.length - 1)) {
                    // If we are at the end but it is completed, maybe user wants to review?
                    // Let's stick to the initial state logic for now to avoid jumping.
                }

                // Force update input for current step if we found history for it
                if (historyMap[activeStep]) {
                    setStepInput(historyMap[activeStep]);
                }

            } catch (err) {
                console.error("Failed to load workflow history", err);
            }
        };
        fetchProgress();
    }, [workflow._id]);

    // Reset input when step changes or when history is loaded
    useEffect(() => {
        const savedInput = completedSteps[activeStep] || '';
        setStepInput(savedInput);
    }, [activeStep, completedSteps]);

    // Safeguard: if steps are missing
    if (!workflow.steps || workflow.steps.length === 0) {
        return <Box p={3}><Typography>No steps defined for this workflow.</Typography><Button onClick={onClose}>Close</Button></Box>;
    }

    const currentStepData = workflow.steps[activeStep];
    if (!currentStepData) return <Box p={3}><Typography>Error loading step data.</Typography><Button onClick={onClose}>Close</Button></Box>;

    const validateInput = () => {
        // Relaxed validation: Just check if not empty if it was touched?
        // Or just allow empty for now to unblock user unless strictly required.
        // Let's require input but drop strict number check
        if (!stepInput || stepInput.trim() === '') return false;

        return true;
    };

    const isStepValid = validateInput();

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleNext = async () => {
        if (!isStepValid) return;

        const inputData = stepInput;
        const newCompleted = { ...completedSteps, [activeStep]: inputData };
        setCompletedSteps(newCompleted);

        try {
            // ALWAYS save progress to backend
            await api.post(`/workflows/${workflow._id}/progress`, {
                completed: activeStep === workflow.steps.length - 1,
                stepIndex: activeStep,
                userInput: inputData
            });

            if (activeStep === workflow.steps.length - 1) {
                toast.success("Workflow Completed!");
                onFinish();
            } else {
                setActiveStep((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Failed to save progress", error);
            toast.error("Failed to save progress");
        }
    };

    // ... (rest of component) ...

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">{workflow.title}</Typography>
                <Button color="inherit" onClick={onClose}>Exit Preview</Button>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {workflow.steps.map((step) => (
                    <Step key={step._id || step.stepNumber}>
                        <StepLabel>{step.title}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <StepContent
                    step={currentStepData}
                    inputValue={stepInput}
                    onInputChange={setStepInput}
                    onComplete={handleNext}
                    isValid={isStepValid}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    variant="contained"
                    disabled={!isStepValid}
                >
                    {activeStep === workflow.steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
        </Paper>
    );
};

export default WorkflowPlayer;
