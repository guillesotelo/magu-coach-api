const dotenv = require('dotenv')
dotenv.config()
const crypto = require('crypto');
const ALG = "aes-256-cbc"
const jwt = require('jsonwebtoken')
const { JWT_SECRET, KEY, IV } = process.env

const encrypt = text => {
    let cipher = crypto.createCipheriv(ALG, KEY, IV);
    let encrypted = cipher.update(text.toString(), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

const decrypt = text => {
    let decipher = crypto.createDecipheriv(ALG, KEY, IV);
    let decrypted = decipher.update(text, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
}

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if (bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1]
        jwt.verify(bearerToken, JWT_SECRET, (error, _) => {
            if (error) return res.sendStatus(403)
            next()
        })
    } else res.sendStatus(403)
}

const getDate = (dateString) => {
    if (dateString) {
        const date = new Date(dateString)
        if (date.getHours() === 24) date.setHours(0)
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
    }
}

const parsePrice = (amount) => {
    if (!amount) return ''
    let amountString = ''
    String(amount).split('').reverse().forEach((letter, i) => {
        if (i !== 0 && i % 3 === 0) amountString += `,`
        amountString += `${letter}`
    })
    return `$ ${amountString.split('').reverse().join('')}`
}

module.exports = {
    encrypt,
    decrypt,
    verifyToken,
    parsePrice,
    getDate
}