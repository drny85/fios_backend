//jshint esversion:6
const mongoose = require('mongoose');

const Referral = require('./referral');

const Schema = mongoose.Schema;

const refereeSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    last_name: {
        type: String,
        lowercase: true.value,
        required: true
    },
    phone: String,
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    referrals: {
        type: [Schema.Types.ObjectId],
        ref: 'Referral'

    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const referre = mongoose.model('Referee', refereeSchema);

module.exports = referre;