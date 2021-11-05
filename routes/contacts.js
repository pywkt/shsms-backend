require('dotenv').config()
const express = require('express');
const contactsRouter = express.Router();

const Contact = require('../db/Schemas/contacts');
const Message = require('../db/Schemas/messages');

contactsRouter.get('/', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    Contact.find({}, (err, contacts) => {
        if (err) throw err;
        res.send(contacts)
    })
})

contactsRouter.post('/updateAlias', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    Contact.findOneAndUpdate(
        { phoneNumber: req.body.phoneNumber, toPhoneNumber: req.body.toPhoneNumber },
        { alias: req.body.newAlias },
        { new: true },
        (err, success) => {
            if (err) throw err;

            res.status(200).json(success)
        })
})

contactsRouter.post('/removeContact', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }

    Contact.findOneAndDelete(
        { toPhoneNumber: req.body.connectedNumber, phoneNumber: req.body.contactToRemove },
        (err, contacts) => {
            if (err) throw err;

            res.status(200).json(contacts)
        })

    Message.deleteMany({ to: req.body.connectedNumber, contact: req.body.contactToRemove },
        (err) => {
            if (err) throw err;
        })
})

module.exports = contactsRouter;