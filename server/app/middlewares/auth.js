const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({error: "Authentication Error. Please login again"})
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id: tokenData.id,
            role: tokenData.role,
            email:tokenData.email
        }
        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({errors: err.message})
    }
}

const authoriseUser = (permittedRoles) => {
    return (req, res, next) => {
        if (permittedRoles.includes(req.user.role)) {
            next()
        } else {
            res.status(403).json({error: "You are not Authorised"})
        }
    }
}

module.exports = {
    authenticateUser,
    authoriseUser
}