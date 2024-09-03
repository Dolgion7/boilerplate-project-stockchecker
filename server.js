const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

app.use(helmet()); // Adds security headers
app.use(express.json());

// Apply rate limiting to the API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

app.use('/', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
