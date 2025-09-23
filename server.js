const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const textRouter = require('./api/verify-text');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/verify-text', textRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});