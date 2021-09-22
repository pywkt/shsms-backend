require('dotenv').config()
const express = require('express');
const contactsRouter = express.Router();

const Contact = require('../db/Schemas/contacts');

contactsRouter.get('/', (req, res) => {
    if (req.headers.enc !== process.env.REQ_TOKEN) {
        return false
    }
    
    Contact.find({}, (err, contacts) => {
        if (err) throw err;
        res.send(contacts)
    })
})

module.exports = contactsRouter;