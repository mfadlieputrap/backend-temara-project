const conn = require('../db/db')
const bcrypt = require('bcrypt')

const CreateUserTable = ()=>{
    const query = `
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL
        )
    `
    conn.query(query, (err, result)=>{
        if(err) throw err
        console.log('Table Users created')
    })
}

const Users = {
    // GET ALL USERS
    getAllUsers: (req, res) => {
        const query = 'SELECT * FROM users'
        conn.query(query, (err, result) => {
            if (err){
                return res.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                })
            }
            res.json(result)
            console.log(result)
            })
    },
    // GET USER BY ID
    getUserById: (req, res) => {
        const id = req.params.id
        const query = 'SELECT * FROM users WHERE id = ?'
        conn.query(query, [id], (err, result)=>{
            if (err) throw err
            res.json(result)
        })
    },
    // GET USER BY EMAIL
    getUserByEmail: (req, callback) => {
        const email = req.body.email
        const query = 'SELECT * FROM users WHERE email = ?';
        conn.query(query, [email], async (err, result) => {
            if (err) {
            callback(err, null);
            } else {
            callback(null, result);
            }
        });
    },
    // UPDATE USER TOKEN
    updateUserToken: (req, callback) => {
        const id = req.id
        const token = req.token
        const query = 'UPDATE users SET refresh_bearer_token = ? WHERE id = ?'
        conn.query(query, [token, id], (err, result)=>{
            if (err){
                callback(err, null)
            }
            callback(null, result)
        })
    },

    //TAMBAH AKUN (REGISTRASI)
    register: async (req, res) =>{
        try{
            const { name, email, no_hp, gender, birthday } = req.body
            Users.getUserByEmail(req, async (err, result) => {
                if (err) {
                  throw err;
                }
                if (result.length > 0) {
                  return res.json({ msg: 'email sudah terdaftar' });
                }
                // Continue with user registration process
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(req.body.password, salt)
                conn.query(`INSERT INTO users (name, email, password, no_hp, gender, birthday)
                VALUES ('${name}', '${email}', '${hash}', '${no_hp}', '${gender}', STR_TO_DATE('${birthday}', '%Y/%m/%d'))`, (err, result) => {
                    if(err){
                        res.status(400).json({ status: 'error', message: 'Data gagal ditambahkan' })
                    }else{
                        res.status(200).json({ status: 'success', message: "Data berhasil ditambah"})
                    }
              })
            })
        }catch(e){
            console.error(e)
            res.status(500).json({ status: 'error', message: "Internal Server Error" })
        }
    }
}

module.exports = Users