//jshint esversion:6
const mongoose = require('mongoose');
const Referee = require('./referee');

const Schema = mongoose.Schema;

const referralSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    last_name: {
        type: String,
        required: true,
        lowercase: true
    },
    address: String,
    apt: String,
    city: String,
    zipcode: Number,
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true
    },
    comment: String,
    status: {
        type: String,
        lowercase: true
    },
    moveIn: String,
    due_date: Date,
    order_date: Date,
    package: String,
    mon: String,
    date_entered: {
        type: Date,
        default: Date.now
    },
    referralBy: {
        type: Schema.Types.ObjectId,
        ref: 'Referee'
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updated: {
        type: String

    },
    email_sent: {
        type: Boolean,
        default: false
    },
    collateral_sent: {
        type: Boolean,
        default: false
    },
    collateral_sent_on: {
        type: Date
    }

});

module.exports = mongoose.model('Referral', referralSchema);