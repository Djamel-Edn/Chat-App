const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    profilePicture: String,
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    archives: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    description: String,
    settings: {
        notifications: {
            message: {
                type: Boolean,
                default: true, 
            },
            sound: {
                type: Boolean,
                default: false, 
            }
        },
        privacy: {
            ContactPossibility: {
                type: String,
                enum: ['everyone', 'nobody'],
                default: 'everyone'
            },
            Activity: {
                type: String,
                enum: ['everyone', 'contacts', 'nobody'],
                default: 'contacts' 
            }
        }
    }
});

module.exports = mongoose.model('User', userSchema);
