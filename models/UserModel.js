const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    
    lastName: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },
    
    password: {
        type: String,
        required: true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    avatar: {
        type: String,
        default: ''
    },
    phone: {
        type: Number,
        default: ''
    },
    profession:{
        type: String,
        default:''
    }


});

module.exports = {User: mongoose.model('user', UserSchema )};