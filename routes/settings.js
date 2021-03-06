require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const settingsRouter = express.Router();

const Message = require('../db/Schemas/messages');
const Contact = require('../db/Schemas/contacts');
const Setting = require('../db/Schemas/settings');
const Image = require('../db/Schemas/media');

settingsRouter.get('/', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    // Uncomment the following lines and restart the server if 
    // something goes wrong with the settings collection and you
    // need to wipe it all out.

    // Setting.deleteMany({}, (err) => {
    //     if (err) throw err
    //     console.log('*** DELETED SETTINGS ***')
    // })

    Setting.findOne({}, (err, arr) => {
        if (!arr) {
            Setting.create({ theme: 'botanical', showImageLink: false, openLists: [], connectedNumbersOrder: [], connectedNumbers: [] })
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
        theme: req.body.theme.newTheme || req.body.theme.slug || 'dots',
        showImageLink: req.body.showImageLink || false,
        openLists: req.body.openLists || [],
        connectedNumbersOrder: req.body.connectedNumbersOrder || [],
        disableNotifications: req.body.disableNotifications || false
    })

    Setting.findByIdAndUpdate({ _id: req.body._id },
        {
            theme: newSettings.theme,
            showImageLink: newSettings.showImageLink,
            openLists: newSettings.openLists,
            connectedNumbersOrder: newSettings.connectedNumbersOrder,
            disableNotifications: newSettings.disableNotifications
        },
        { new: true },
        (err, success) => {
            if (err) {
                throw err
            } else {
                res.status(200).json(success)
            }
        })
})

settingsRouter.post('/openCloseList', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    Setting.findOneAndUpdate({}, { openLists: req.body }, { new: true }, (err, settings) => {
        res.status(200).json(settings)
    })
})

settingsRouter.post('/disableNotifications', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    console.log('req.body:', req.body)

    Setting.findOneAndUpdate({}, { disableNotifications: req.body.disableNotifications }, { new: true }, (err, updatedSettings) => {
        res.status(200).json(updatedSettings)
    })
})

settingsRouter.post('/updateConnectedAlias', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    Setting.findOneAndUpdate({}, { $set: { connectedNumbers: req.body } }, { new: true }, (err, success) => {
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
            Setting.findOneAndUpdate({}, { openLists: [], connectedNumbersOrder: [], connectedNumbers: [] }, { new: true }, (err) => {
                if (err) throw err
                console.log('** RESET SETTINGS **')
            })
        }).then(() => {
            res.send('ALL YOUR BASE ARE BELONG TO US')
        })
    } else {
        console.log('NOT TODAY')
        return
    }
})

module.exports = settingsRouter;