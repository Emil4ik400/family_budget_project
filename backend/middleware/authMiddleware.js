const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

if(!SECRET){
    throw new Error('JWT_SECRET is not defined in .env');
}

module.exports = function authMiddleware(req,res,next){
    const authHeader = req.headers['authorization'];

if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({ error: 'No token provided'});
}

const token = authHeader.split(' ')[1];

try{
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
} catch (error){
    console.error('Token verification failed:', error);
    res.status(401).json({error: 'Invalid token'});
}
};