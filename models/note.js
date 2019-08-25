const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Note', noteSchema);