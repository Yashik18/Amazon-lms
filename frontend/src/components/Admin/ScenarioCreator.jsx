import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ScenarioCreator = () => {
    // Basic Details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('beginner');
    const [category, setCategory] = useState('General');
    const [dataSnapshot, setDataSnapshot] = useState('');

    // Dynamic Questions State
    const [questions, setQuestions] = useState([
        {
            text: '',
            options: [
                { text: '', isCorrect: false, explanation: '' },
                { text: '', isCorrect: false, explanation: '' }
            ]
        }
    ]);

    // Handlers for Question Text
    const handleQuestionTextChange = (qIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].text = text;
        setQuestions(newQuestions);
    };

    // Handlers for Options
    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex][field] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        // Set all to false first
        newQuestions[qIndex].options.forEach(opt => opt.isCorrect = false);
        // Set selected to true
        newQuestions[qIndex].options[oIndex].isCorrect = true;
        setQuestions(newQuestions);
    };

    // Add/Remove Operations
    const addQuestion = () => {
        setQuestions([...questions, {
            text: '',
            options: [
                { text: '', isCorrect: false, explanation: '' },
                { text: '', isCorrect: false, explanation: '' }
            ]
        }]);
    };

    const removeQuestion = (index) => {
        if (questions.length === 1) return;
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ text: '', isCorrect: false, explanation: '' });
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length <= 2) {
            toast.warning("Minimum 2 options required");
            return;
        }
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };


    const handleSave = async () => {
        try {
            // Validation
            if (!title || !description) {
                toast.error("Title and Description are required");
                return;
            }

            let parsedContext = {};
            try {
                parsedContext = dataSnapshot ? JSON.parse(dataSnapshot) : {};
            } catch (e) {
                toast.error("Invalid JSON in Data Snapshot");
                return;
            }

            // Construct payload
            const payload = {
                title,
                description,
                difficulty,
                category,
                context: {
                    situation: description,
                    ...parsedContext
                },
                questions: questions.map(q => ({
                    text: q.text,
                    options: q.options.map(opt => ({
                        text: opt.text,
                        isCorrect: opt.isCorrect,
                        explanation: opt.isCorrect ? (opt.explanation || 'Correct answer') : 'Incorrect'
                    }))
                })),
                idealAnswer: 'See options explanations'
            };

            await api.post('/admin/scenarios', payload);
            toast.success('Scenario created!');

            // Reset form
            setTitle('');
            setDescription('');
            setDataSnapshot('');
            setQuestions([{
                text: '',
                options: [
                    { text: '', isCorrect: false, explanation: '' },
                    { text: '', isCorrect: false, explanation: '' }
                ]
            }]);

        } catch (error) {
            console.error(error);
            toast.error('Failed to create scenario');
        }
    };

    return (
        <Box maxWidth="lg">
            <Typography variant="h5" gutterBottom>Create New Scenario</Typography>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom color="primary">1. Scenario Details</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                    <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <FormControl fullWidth>
                        <InputLabel>Difficulty</InputLabel>
                        <Select value={difficulty} label="Difficulty" onChange={(e) => setDifficulty(e.target.value)}>
                            <MenuItem value="beginner">Beginner</MenuItem>
                            <MenuItem value="intermediate">Intermediate</MenuItem>
                            <MenuItem value="advanced">Advanced</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TextField fullWidth multiline rows={3} label="Situation / User Context" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Data Snapshot (JSON format)"
                    value={dataSnapshot}
                    onChange={(e) => setDataSnapshot(e.target.value)}
                    placeholder='e.g. {"metrics": {"Revenue": "$50k"}, "marketData": {"Competitor": "ABC Corp"}}'
                    helperText="Optional: Paste JSON data to provide simulated context for the scenario"
                    sx={{ mb: 2, fontFamily: 'monospace' }}
                />
            </Paper>

            <Typography variant="h6" gutterBottom color="primary">2. Questions & Options</Typography>

            {questions.map((q, qIndex) => (
                <Paper key={qIndex} sx={{ p: 3, mb: 3, borderLeft: '6px solid #1976d2' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Question {qIndex + 1}</Typography>
                        <IconButton onClick={() => removeQuestion(qIndex)} color="error" disabled={questions.length === 1}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                    <TextField
                        fullWidth
                        label={`Question Text`}
                        value={q.text}
                        onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>Answer Options</Typography>
                        <Typography variant="caption" sx={{ mr: 4, color: 'text.secondary' }}>Mark Correct</Typography>
                    </Box>

                    {q.options.map((opt, oIndex) => (
                        <Box key={oIndex} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={opt.isCorrect}
                                    onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    title="Mark as correct answer"
                                />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label={`Option ${oIndex + 1}`}
                                    value={opt.text}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                                    sx={{ mb: 1 }}
                                />
                                {opt.isCorrect && (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Explanation (Why is this correct?)"
                                        value={opt.explanation}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'explanation', e.target.value)}
                                        color="success"
                                        focused
                                    />
                                )}
                            </Box>
                            <IconButton onClick={() => removeOption(qIndex, oIndex)} size="small" sx={{ mt: 1 }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}

                    <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => addOption(qIndex)}
                        size="small"
                        sx={{ ml: 4 }}
                    >
                        Add Another Option
                    </Button>
                </Paper>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={addQuestion}
                    sx={{ mr: 2 }}
                >
                    Add New Question
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    size="large"
                    sx={{ px: 4 }}
                >
                    Save Complete Scenario
                </Button>
            </Box>
        </Box>
    );
};

export default ScenarioCreator;
