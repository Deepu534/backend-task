const mongoose = require('mongoose')
const { stringify } = require('querystring')
const { PassThrough } = require('stream')
const bcrypt = require('bcryptjs')
    //define schema
const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        }

    })
    //hash password before save in db
userSchema.statics.encryptPassword = async(password) => {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }
    //compare password{}
userSchema.statics.comparePassword = async(password, recievedPassword) => {
    return await bcrypt.compare(password, recievedPassword)
}

module.exports = mongoose.model('User', userSchema)