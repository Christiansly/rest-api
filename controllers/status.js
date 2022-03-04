const User = require("../models/user")

exports.getStatus = (req, res, next) => {
    if(!req.userId) {
        const error = new Error('Status not available')
        error.statusCode = 404
        next(error)
    }

    User.findById(req.userId).then(user => {
        const status = user.status
        res.status(200).json({
            status: status
        })
    }).catch(err => {
        if (!err.statusCode) err.statusCode = 404
        next(err)
    })
}

exports.updateStatus = (req, res, next) => {
    const status = req.body.status
    console.log(status)
    if(!req.userId) {
        const error = new Error('Status not available')
        error.statusCode = 404
        next(error)
    }

    User.findById(req.userId).then(user => {
        user.status = status
        return user.save()
       
    }).then(result => {
        res.status(200).json({
            status: status
        })
    }).catch(err => {
        if (!err.statusCode) err.statusCode = 404
        next(err)
    })
}