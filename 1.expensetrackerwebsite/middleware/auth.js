const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticate = (req, res, next) => {

    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, 'secretkey');
        console.log('userID >>>> ', user.userId);
        //const userid = Number(jwt.verify(token, process.env.TOKEN_SECRET));

        User.findByPk(user.userId).then(user => {
            req.user = user; ///ver
            next();
        }).catch(err => { throw new Error(err)})

      //   User.findByPk(userid).then(user => {
      //     console.log(JSON.stringify(user));
      //     req.user = user;
      //     next();
      // }).catch(err => { throw new Error(err)})

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
        // err
      }
}

module.exports = {
    authenticate
}