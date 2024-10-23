// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file
const DATA_FILE = path.join(__dirname, 'answers.json');

// Helper function to read data from JSON file
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper function to write data to JSON file
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Endpoint to save student answers
app.post('/save-answers', (req, res) => {
    const { registerNo, answers } = req.body;

    if (!registerNo || !answers) {
        return res.status(400).json({ message: 'Register number and answers are required.' });
    }

    const data = readData();
    data[registerNo] = answers;
    writeData(data);

    res.status(200).json({ message: 'Answers saved successfully.' });
});

// Endpoint to retrieve student answers by register number
app.get('/get-answers/:registerNo', (req, res) => {
    const registerNo = req.params.registerNo;
    const data = readData();

    if (data[registerNo]) {
        res.status(200).json({ registerNo, answers: data[registerNo] });
    } else {
        res.status(404).json({ message: 'No answers found for the provided register number.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
