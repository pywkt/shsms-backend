require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const mediaRouter = express.Router();
const fs = require('fs');
const FileType = require('file-type')

const Image = require('../db/Schemas/media');

mediaRouter.get('/:id', (req, res) => {
    fs.readFile(`${process.cwd()}/media/${req.params.id}`, (err, data) => {
        if (err) res.status(500).send(err);

        res.sendFile(`${process.cwd()}/media/${req.params.id}`)
    })
})

mediaRouter.post('/upload', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    const mime = req.body.photo.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    const split = req.body.photo.split(',');
    const base64string = split[1];
    const buffer = Buffer.from(base64string, 'base64');


    const final_img = new Image({
        _id: new mongoose.Types.ObjectId,
        img: {
            contentType: mime[1],
            data: buffer
        }
    });

    final_img.save((err, result) => {
        if (err) {
            throw err
        } else {
            console.log("Saved To database");
        }

        Image.findById(final_img._id, async (err, img) => {
            const buffer = await Buffer.from(img.img.data);
            const fileType = await FileType.fromBuffer(img.img.data);

            if (fileType.ext) {
                const outputFileName = `image-${Date.now()}.${fileType.ext}`

                fs.writeFile(`./media/${outputFileName}`, buffer, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("File saved successfully!");
                    res.send({ savedImage: outputFileName })
                })
            } else {
                console.log('File type could not be reliably determined! The binary data may be malformed! No file saved!')
            }
        })
    })
})

module.exports = mediaRouter;