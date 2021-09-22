require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const messagesRouter = express.Router();
const fs = require('fs');
const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const Message = require('../db/Schemas/messages');
const MessageData = require('../db/Schemas/messageData');
const Contact = require('../db/Schemas/contacts');

messagesRouter.get('/:id', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    Contact.findOne({ phoneNumber: req.params.id }).populate(
        { path: 'messages', model: 'Message' }).exec((err, contact) => {
            res.send({ alias: contact.alias, messages: contact.messages.data })
        })
})

// Can be used to show all media as a gallery at a later date
messagesRouter.get('/media', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    const dir = `${process.cwd()}/media`
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }

        files.forEach(file => {
            console.log(file)

        });

    });
    res.send(200)
})

messagesRouter.post('/', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    const isFromTwilio = Boolean(req.headers['x-custom-header'] === 'Twilio');

    if (!isFromTwilio) {
        try {
            client.messages
                .create({
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: req.body.phoneNumber,
                    body: req.body.message || '',
                    mediaUrl: [req.body?.attachedMedia?.[0]] || null
                })
                .catch(err => {
                    res.send(JSON.stringify({ success: false }));
                });
        } catch (err) {
            throw err
        }
    }

    const newMessageData = new MessageData({
        _id: new mongoose.Types.ObjectId(),
        to: isFromTwilio ? process.env.TWILIO_PHONE_NUMBER : req.body.phoneNumber,
        from: isFromTwilio ? req.body.phoneNumber : process.env.TWILIO_PHONE_NUMBER,
        date: req.body.date,
        body: req.body.message,
        media: req.body.attachedMedia
    })

    const newMessage = new Message({
        _id: new mongoose.Types.ObjectId(),
        contact: req.body.phoneNumber,
        data: newMessageData
    })

    const newContact = new Contact({
        _id: new mongoose.Types.ObjectId(),
        phoneNumber: req.body.phoneNumber,
        lastMessageRecieved: req.body.date,
        messages: newMessage._id,
        alias: req.body.alias || ''
    })

    Contact.find({ phoneNumber: req.body.phoneNumber }, (err, arr) => {
        if (arr.length !== 0) {
            Message.findOneAndUpdate({ contact: req.body.phoneNumber },
                { $push: { data: newMessageData } }, { new: true }, (err, success) => {
                    if (err) {
                        throw err
                    } else {
                        res.send(success)
                        io.emit('FromApi', success)
                    }
                })
            Contact.findOneAndUpdate({ phoneNumber: req.body.phoneNumber },
                { lastMessageRecieved: newMessageData.date }, { new: true }, (err, success) => {
                    if (err) {
                        throw err
                    } else {
                        Contact.find({}, (err, arr) => io.emit('updateContacts', arr))
                    }
                })
        } else {
            newContact.save((err) => {
                if (err) throw err
                console.log('******* CONTACT SAVED')

                newMessage.save((err) => {
                    if (err) throw err
                    console.log('******** MESSAGE SAVED')

                    Contact.find({}, (err, contacts) => {
                        if (err) throw err
                        console.log('******** FINDING CONTACTS')

                        res.send(contacts)
                        io.emit('updateContacts', contacts)
                    })
                })
            })
        }
    })
})

module.exports = messagesRouter;