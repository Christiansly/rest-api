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
    const newStatus = req.body.status;
    User.findById(req.userId)
      .then(user => {
        if (!user) {
          const error = new Error('User not found.');
          error.statusCode = 404;
          throw error;
        }
        user.status = newStatus;
        return user.save();
      })
      .then(result => {
        res.status(200).json({ message: 'User updated.' });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}