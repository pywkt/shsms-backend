require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const settingsRouter = express.Router();

const Message = require('../db/Schemas/messages');
const Contact = require('../db/Schemas/contacts');
const Setting = require('../db/Schemas/settings');
const Image = require('../db/Schemas/media');

settingsRouter.get('/', (req, res) => {
    console.log('settings:', req.headers)
    // if (req.headers.enc !== process.env.REQ_TOKEN) {
    //     return false
    // }

    Setting.find({}, (err, arr) => {
        if (arr.length === 0) {
            Setting.create({ theme: 'botanical', showImageLink: false })
        }

        res.status(200).json(arr)
    })
})

settingsRouter.post('/', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    const newSettings = new Setting({
        _id: new mongoose.Types.ObjectId(),
        theme: req.body.theme.newTheme,
        showImageLink: req.body.showImageLink
    })

    Setting.findByIdAndUpdate({ _id: req.body._id }, { theme: newSettings.theme, showImageLink: req.body.showImageLink }, { new: true }, (err, success) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Settings updated:', success)
            res.status(200).json(success)
        }
    })
})

settingsRouter.post('/updateAlias/:id', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    Contact.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { alias: req.body.newAlias }, { new: true }, (err, success) => {
        if (err) throw err;

        res.status(200).json(success)
    })
})

settingsRouter.post('/dropTables', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    if (req.body.confirm === 'burnEverything') {
        Message.deleteMany({}, (err) => {
            if (err) throw err
            console.log('*** DELETED MESSAGES ***')
        }).then(() => {
            Contact.deleteMany({}, (err) => {
                if (err) throw err
                console.log('*** DELETED CONTACTS ***')
            })
        }).then(() => {
            Image.deleteMany({}, (err) => {
                if (err) throw err
                console.log('** DELETED MEDIA **')
            })
        }).then(() => {
            res.send('ALL YOUR BASE ARE BELONG TO US')
        })
    } else {
        console.log('NO DROP THIS TIME')
        return
    }
})

module.exports = settingsRouter;