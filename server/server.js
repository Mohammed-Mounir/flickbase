const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const routes = require('./routes');

const { handleError, convertToApiError } = require('./middleware/apiError');

require('dotenv').config();

const app = express();

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`;
mongoose.connect(mongoUri);

// MIDDLEWARES //

// parsing
app.use(bodyParser.json());

// sanitize
app.use(xss());
app.use(mongoSanitize());

// routes
app.use('/api', routes);

// error handling
app.use(convertToApiError);
app.use((err, req, res, next) => {
  handleError(err, res);
  next();
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
