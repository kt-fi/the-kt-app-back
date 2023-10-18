const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) =>{

    let payload;

    if(req.headers.authorization === undefined){
        return res.status(401).send('Unautorized Request')
    }
    if(!req.headers.authorization){
        return res.status(401).send('Unautorized Request')
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token === null) {
        return res.status(401).send('Unautorized Request')
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, userId) => {
        if(err){
            return res.status(401).send('Unautorized Request')
        }
        payload = userId
    });
    if(!payload){
        return res.status(401).send('Unautorized Request')
    }
    req.userId = payload.subject;
    next();
}


module.exports = {verifyToken};