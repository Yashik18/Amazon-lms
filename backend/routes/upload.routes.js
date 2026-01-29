const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/chat');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Check mime
    const mimetype =
        file.mimetype.startsWith('image/') ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        console.error(`File Upload Rejected: ${file.originalname} (Type: ${file.mimetype})`); // Add logging
        cb(new Error('Error: File type not supported!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// @desc    Upload a single file
// @route   POST /api/v1/upload
// @access  Public (Protected by Auth Middleware in server.js usually, but verified here if needed)
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/chat/${req.file.filename}`;

        res.json({
            success: true,
            data: {
                url: fileUrl,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                localPath: req.file.path
            }
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
