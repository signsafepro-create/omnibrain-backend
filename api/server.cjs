const express = require('express');
const path = require('path');
const app = express();

// Serve the static files from the 'web' folder
app.use(express.static(path.join(__dirname, '../web')));

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend running on http://localhost:${PORT}`);
});
