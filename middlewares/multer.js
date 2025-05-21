const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // To generate unique filenames

// Create the uploads/licenses directory if it doesn't exist
const uploadDir = './uploads/licenses';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Set upload directory
    },
    filename: function (req, file, cb) {
        const uniqueFilename = uuidv4(); // Generate a unique ID for the file
        const extension = path.extname(file.originalname); // Get the file extension

        cb(null, `${uniqueFilename}${extension}`); // Save the file with the unique name
    }
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf']; // MIME type for PDFs
    const fileMimeType = file.mimetype;

    if (!allowedMimeTypes.includes(fileMimeType)) {
        return cb(new Error('Only PDF files are allowed!'), false); // Reject file
    }

    cb(null, true); // Accept the file
};

// Configure multer upload with storage and fileFilter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload
