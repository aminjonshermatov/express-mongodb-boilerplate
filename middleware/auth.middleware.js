const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        if (!token) {
            return res.status(400).json({ message: 'Нет авторизации', success: false });
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        res.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Нет авторизации', success: false });
    }
};