const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    img: {
        data: Buffer,
        contentType: String
    }
});

const Image = mongoose.model("Image", imgSchema);

module.exports = Image;