const { delUserData, authUser, getAllUser, registrasi }  = require('../controllers/userData')
const conn = require('../db/db')
const jwt = require('jsonwebtoken')
const VerifyToken = require('../middleware/VerifyToken')

const setupRoutes = (app)=>{
    app.get('/api/users', VerifyToken, getAllUser)

    app.post('/api/users/register', registrasi)

    app.delete('/api/users/delete/:id', (req, res)=>{
        delUserData(req, (result)=>{
            res.json(result)
        })
    })

    app.post('/api/users/auth', authUser)

    app.post('/login', (req,res)=>{
        
        const user ={
            email: "fadlie@gmail.com",
            password: "123456"
        }
        jwt.sign(user, 'secret', (err, token)=>{
            if(err) throw err
            const Token = token
            res.json({
                user: user,
                token: Token
            })
        })
        
    })

    app.post('/auth', authLogin, (req, res)=>{
        res.json({
            data: req.body
        })
    })

function authLogin(req, res, next){
    const bearer = req.headers.bearer
    jwt.verify(bearer, 'secret', (err,decoded)=>{
        if (err){
            res.json({
                error: 'Invalid Token'
            })
            return
        }
        req.body = decoded
        next()
    })
}

}

module.exports = setupRoutes