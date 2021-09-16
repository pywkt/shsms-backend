require('dotenv').config()
const app = require('./app');
const mongoose = require('mongoose');
const db = require('./db');
const { corsSocketOptions } = require('./config');
const server = require('http').createServer(app);

global.io = require('socket.io')(server, corsSocketOptions)

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`))

