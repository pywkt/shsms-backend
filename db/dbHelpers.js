const getAllContacts = (schema) => {
    schema.find({}).exec((err, contact) => {
        if (err) throw err;
    })
}

const getAllMessages = (schema) => {
    schema.find({}).exec((err, messageList) => {
        if (err) throw err;

        return messageList
    })
}

const removeById = (schema, id) => {
    schema.findById(id, (err, contact) => {
        if (err) throw err
        if (!contact) { console.log('contact not found'); return }
        contact.remove(err => {
            if (err) throw err
        })
    })
}

module.exports = { getAllContacts, getAllMessages, removeById };