const mongoose = require('mongoose');

const messageDataSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    body: String,
    media: Array
})

const MessageData = mongoose.model('MessageData', messageDataSchema);

module.exports = MessageData;