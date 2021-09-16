const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const { corsOptions } = require('./config');

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb'}));
app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }));
app.use(morgan('dev'));

const contactsRouter = require('./routes/contacts');
const messagesRouter = require('./routes/messages');
const settingsRouter = require('./routes/settings');
const mediaRouter = require('./routes/media');
app.use('/contacts', contactsRouter);
app.use('/messages', messagesRouter);
app.use('/settings', settingsRouter);
app.use('/media', mediaRouter);

module.exports = app