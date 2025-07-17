const jwt = require("jsonwebtoken");


require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRETADMIN;

function adminMiddleware(req,res,next){
  const token = req.headers.token;
  if(!token){
    return res.status(403).send({
      "message": "not signed in."
    })
  }
  try{
    const decodedInformation = jwt.verify(token,JWT_SECRET);

    if(!decodedInformation.id){
      return res.status(403).send("NOT LOGGED IN");
    }
    const id = decodedInformation.id;
    req.id = id;
    next();
  }catch(e){
    res.status(403).json({
      message: "INVALID TOKEN."
    })
  }
  
}

module.exports = adminMiddleware;