const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcryptjs.hash(password, 12).then(hashedPass => {
      const user = new User({
          email: email,
          password: hashedPass,
          name: name
      })
      return user.save()
  }

  ).then(result => {
      res.status(201).json({ message: 'User created', userId: result._id})
  }).catch(err => {
      if(!err.statusCode) {
          err.statusCode = 500
      }
      next(err)
  });
};


exports.login = (req, res, next) => {
    const {email, password} = req.body
    let loadUser = ""
    User.findOne({email: email}).then(
        user => {
            if(!user) {
                const error = new Error("Can't find email")
                error.statusCode = 401
                throw error
            }
            loadUser = user
            return bcryptjs.compare(password, user.password)
        }
    ).then(
        isEqual => {
            if(!isEqual) {
                const error = new Error("Password Incorrect")
                error.statusCode = 401
                throw error
            }
            const token = jsonwebtoken.sign(
                {
                    email: loadUser.email,
                    userId: loadUser._id.toString()
                },
                'secret',
                {expiresIn: '1h'}
            )
            res.status(200).json({
                token: token,
                userId: loadUser._id.toString()
            })
        }
        
    ).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}