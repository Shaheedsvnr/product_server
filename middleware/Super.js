const jwt = require('jsonwebtoken')
const JWT_SECRET = "product";
const fetchAdmin = (req, res, next) =>{
    const token = req.header("auth-token")
    console.log(token);
    if(!token){
        return res.status(401).send({error: "Access denied! No token provided"})
    }
    try{
        const superA = jwt.verify(token,JWT_SECRET);
        console.log("super admin id:",superA)
        console.log(token,'token');
        req.superA=superA;
        next();
    }
    catch(err){
        res.status(403).send({message:"Invalid Token!"})
    }
}
module.exports = fetchAdmin;