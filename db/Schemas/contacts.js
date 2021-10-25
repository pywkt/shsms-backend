const mongoose = require('mongoose');

const contactsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phoneNumber: {
        type: String,
        required: true,
    },
    alias: {
        type: String,
        unique: false
    },
    lastMessageRecieved: {
        type: Date,
        default: Date.now()
    },
    messages:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    toPhoneNumber: String
})

const Contact = mongoose.model('Contact', contactsSchema)

module.exports = Contact;