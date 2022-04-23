const user = require('../model/user.js')
const jwt = require('jsonwebtoken')
exports.signUp = async(req, res) => {
    const { name, email, password } = req.body

    const newuser = new user({
        name,
        email,
        password: await user.encryptPassword(password)
    })
    const saveduser = await newuser.save()
    console.log(saveduser)

    const newToken = jwt.sign({ id: saveduser._id }, 'secretkey', {
        expiresIn: 86400
    })
    res.status(200).json({ newToken })
}

exports.logIn = async(req, res) => {
    const userexist = await user.findOne({ email: req.body.email })

    if (!userexist) return res.status(400).json({ message: "user not exists" })
    const matchpassword = await user.comparePassword(req.body.password, userexist.password)
    if (!matchpassword) return res.status(401).json({ token: null, message: 'invalid password' })
    console.log('userexits')
    const token = jwt.sign({ id: userexist._id }, 'secretKey', {

        expiresIn: 86400
    })
    return res.json({
        _id: userexist._id,
        name: userexist._id,
        message: 'auth successfull',
        token: token
    })
}