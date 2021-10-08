const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    theme: {
        type: String,
        default: 'botanical'
    },
    showImageLink: {
        type: Boolean,
        default: false
    },
    openLists: Array,
    connectedNumbersOrder: Array
})

const Settings = mongoose.model('Settings', settingsSchema)

module.exports = Settings;