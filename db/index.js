const mongoose = require('mongoose');

// Models
const Contact = require('./Schemas/contacts');
const Message = require('./Schemas/messages');
const Setting = require('./Schemas/settings');
const Image = require('./Schemas/media');

const uri = process.env.MONGO_DB_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    useCreateIndex: true,
    useFindAndModify: true
}, err => {
    if (err) throw err
    console.log(`Database: Connected > ${uri}`)

    Contact.find({}, (err, collection) => {
        if (!collection) {
            mongoose.connection.createCollection('contacts', (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Contacts Collection Created')
                }
            })
        }
    })

    Message.find({}, (err, collection) => {
        if (!collection) {
            mongoose.connection.createCollection('messages', (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Messages Collection Created')
                }
            })
        }
    })

    Setting.find({}, (err, collection) => {
        if (!collection) {
            mongoose.connection.createCollection('settings', (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Settings Collection Created')
                    const defaultSettings = new Setting({
                        _id: new mongoose.Types.ObjectId(),
                        theme: 'botanical',
                        showImageLink: false,
                        openLists: [],
                        connectedNumbersOrder: [],
                        connectedNumbers: [],
                        disableNotifications: false
                    })

                    defaultSettings.save()
                    console.log('Default settings saved')

                }
            })
        }
    })

    Image.find({}, (err, collection) => {
        if (!collection) {
            mongoose.connection.createCollection('Image', (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Image Collection Created')
                }
            })
        }
    })
})