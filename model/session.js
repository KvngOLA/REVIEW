const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    expires: { type: Date },
    session: { type: Object }

}, {
    timestamps: true
})

const sessionModel = mongoose.model('session', sessionSchema)

module.exports = sessionModel