const jwt = require("jsonwebtoken");
const privateKey = "mySecretKeyabs";
var user = require("../models/user");

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  user.findOne({ where: { token: token } }).then((e) => {
    if(e)
      {
        if (!token) {
          return res.status(403).send("A token is required for authentication");
        }
        try {
          const decoded = jwt.verify(token, privateKey);
          req.user = decoded;
        } catch (err) {
          return res.status(401).send("Invalid Token");
        }
        return next();
      }
    else {
      const decoded = jwt.verify(token, privateKey);
      req.user = decoded;
      user.update({
        token:null
      },{where:{id:req.user.id}})
    }
  });
};

module.exports = verifyToken;
