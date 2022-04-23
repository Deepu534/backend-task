const jwt = require('jsonwebtoken')
const User = require('../model/user.js')
exports.verifyToken = async(req, res, next) => {
    const secretKey = process.env.KEY || 'secretKey'
    try {
        const token = req.headers['x-access-token']
        if (!token) return res.status(403).json({
            message: 'no token provided'
        })
        const decoded = jwt.verify(token, secretKey)
        req.userId = decoded.id

        const user = await User.findById(req.userId, { password: 0 })
        if (!user) return res.status(404).json({
            message: 'no user found'
        })
        next()
    } catch (error) {
        return res.status(401).json({
            message: "unauthorized"
        })
    }
}