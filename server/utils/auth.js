const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim();
    }
    //if no token return object as is
    if (!token) {
      return req;
    }

    try {
      //attach destructured data to the request object
      //throws err if secret doesnt match
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    //return updated object
    return req;
  },
  //expects user obj
  //adds username, email, id to token
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    //secret allows for validation
    //can be given an expiration date
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};
