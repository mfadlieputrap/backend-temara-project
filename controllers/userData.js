const conn = require('../db/db')
const Users = require('../models/UserModel')
const bcrypt = require('bcrypt')
const CircularJSON = require('circular-json')
const jwt = require('jsonwebtoken')

const getAllUser = (req,res)=>{
    Users.getAllUsers((err, users)=>{
        if(err) throw err
        res.json(users)
    }, res)
}





const registrasi = async (req, res) => {
    try{
    Users.register(req, res)
  }catch(err) {
    // handle any errors that may occur
    console.error(err);
  }

}


const authUser = (req, res) => {
    try{
        const password = req.body.password
        Users.getUserByEmail(req, async (err, result) =>{
            if(err) throw err
            const userId = result[0].id
            const name = result[0].name
            const email = result[0].email
            const isMatch = await bcrypt.compare(password, result[0].password);
            if(!isMatch) return res.status(400).json({ message: "Password Salah"})
            
            const bearerToken = jwt.sign({userId, name, email}, process.env.ACC_JWT_SECRET, { expiresIn: "40s"})
            const refreshBearerToken = jwt.sign({userId, name, email}, 'secret', { expiresIn: "1d"})

            Users.updateUserToken({id:userId, token:refreshBearerToken},(err)=>{
                if(err) return res.status(500).json({
                    status: 'error',
                    message: 'Internal Server Error'
                })
            })
            res.status(200).json({
                status: 'success',
                data: {
                    userId: userId,
                    token: bearerToken
                }
            })
        })
    }catch(e){
        console.error(e)
        res.status(500).send("Internal server error")
    }
    // try{
        
    //     console.log(authUser)
    //         if(!authUser){
    //             return res.status(404).json({ message:'Invalid email or password'})
    //         }
        
    //     const isMatch = await bcrypt.compare(password, authUser.password)
    //     if(!isMatch){
    //         return res.status(401).json({ message: 'Invalid email or password' });
    //     }
    // }catch(e){
    //     console.error(e)
    //     return res.status(500).json({ message: "Internal server error" })
    // }

}
        
function delUserData(req, res){
    const id = req.params.id
    conn.query(`DELETE FROM user WHERE id = ${id}`, (err) => {
        if (err) {
            console.error(err)
            }else{
                res.status(201).send("Data berhasil dihapus")
            }
            
        })
}

module.exports = { registrasi, getAllUser, delUserData, authUser}