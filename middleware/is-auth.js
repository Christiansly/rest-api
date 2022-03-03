const jsonwebtoken = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const Authorization = req.get('Authorization')

    if(!Authorization) {
        const error = new Error("Not Authenticated")
        error.statusCode = 401
        throw error
    }

    const token = Authorization.split(' ')[1]
    let decodedToken;
    try {
        decodedToken = jsonwebtoken.verify(token, 'secret')
    } catch(err) {
        err.statusCode = 500
        throw err
    }
    if(!decodedToken) {
        const error = new Error('Not Authenticated')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}