import React, { useState } from 'react';
import {
    Box, Typography, Button, Paper, RadioGroup, FormControlLabel, Radio, CircularProgress, Grid, LinearProgress
} from '@mui/material';
import DataPanel from './DataPanel';
import FeedbackPanel from './FeedbackPanel';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ScenarioPlayer = ({ scenario, onClose }) => {
    // scenario.questions is now an array
    const questions = scenario.questions || [{ text: scenario.question, options: scenario.options }]; // Fallback for old data

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: "Option A", 1: "Option B" }
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleOptionChange = (val) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: val }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // We submit ALL answers
            // Backend endpoint might need update to handle array of answers, or we concatenate them for now
            // To keep it simple for AI evaluation, we can send a summary string or just the final answer if logic dictates.
            // But realistically, we should evaluate all.
            // Let's assume we simply join them for the AI prompt for now to prove the flow.

            const combinedAnswer = Object.entries(answers)
                .map(([idx, ans]) => `Q${Number(idx) + 1}: ${ans}`)
                .join(' | ');

            const res = await api.post(`/scenarios/${scenario._id}/submit`, {
                answer: combinedAnswer
            });

            // Backend returns: { success: true, data: { score, feedback, ... } }
            // Axios response.data is the body. So we need res.data.data
            const resultData = res.data.data || {};

            // Ensure score is a number (handle 0 correctly)
            const score = resultData.score !== undefined ? resultData.score : 0;

            setResult({
                score: score,
                feedback: resultData.feedback,
                explanation: resultData.explanation || "See below for details.",
                correctOption: { explanation: "See rubric for details on all questions." }
            });

        } catch (error) {
            console.error(error);
            toast.error("Evaluation failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (result) {
        return (
            <FeedbackPanel
                result={result}
                onRetry={() => { setResult(null); setCurrentQuestionIndex(0); setAnswers({}); }}
                onExit={onClose}
            />
        );
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">{scenario.title}</Typography>
                <Button color="inherit" onClick={onClose}>Exit</Button>
            </Box>

            <Grid container spacing={3} sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%', overflowY: 'auto' }}>
                    <DataPanel context={scenario.context} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Paper elevation={3} sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={((currentQuestionIndex + 1) / questions.length) * 100}
                                sx={{ mt: 1, mb: 2 }}
                            />
                        </Box>

                        <Typography variant="h6" gutterBottom>{currentQuestion.text}</Typography>

                        <RadioGroup
                            value={answers[currentQuestionIndex] || ''}
                            onChange={(e) => handleOptionChange(e.target.value)}
                        >
                            {currentQuestion.options.map((opt, idx) => (
                                <Paper key={idx} variant="outlined" sx={{ mb: 1, p: 1 }}>
                                    <FormControlLabel
                                        value={opt.text}
                                        control={<Radio />}
                                        label={opt.text}
                                        sx={{ width: '100%', m: 0 }}
                                    />
                                </Paper>
                            ))}
                        </RadioGroup>
                    </Paper>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            disabled={currentQuestionIndex === 0}
                            onClick={handlePrevious}
                        >
                            Previous
                        </Button>

                        {isLastQuestion ? (
                            <Button
                                variant="contained"
                                size="large"
                                disabled={!answers[currentQuestionIndex] || submitting}
                                onClick={handleSubmit}
                            >
                                {submitting ? <CircularProgress size={24} /> : 'Submit Assessment'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={!answers[currentQuestionIndex]}
                            >
                                Next Question
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ScenarioPlayer;
