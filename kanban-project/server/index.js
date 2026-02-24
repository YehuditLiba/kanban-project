const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const boardRoutes = require('./routes/board');
const taskRoutes = require('./routes/tasks');

app.use('/api/board', boardRoutes);
app.use('/api/tasks', taskRoutes);

const columnRoutes = require('./routes/columns');
app.use('/api/columns', columnRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));