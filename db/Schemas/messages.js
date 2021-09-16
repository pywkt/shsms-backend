const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    contact: String,
    data: [{
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
    }]
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message