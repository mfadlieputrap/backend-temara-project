const mysql = require('mysql')
// const bcrypt = require('bcrypt')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'temara'
})

conn.connect(function(error){
    if(error) throw error
    console.log('Connected to temara')
    // async function coba(){
    //     const password = "wowowo"
    //     const salt = await bcrypt.genSalt(10)
    //     const hash = await bcrypt.hash(password, salt)
    //     return console.log(hash) 
    // }
    // coba()

    // async function cobi(){
    //     const auth = await bcrypt.compare("wowowo","$2b$10$a1qbVD.W.Sy9XXrkNrVGaehQlOx3i09bp2hOgmrs4D.bNBHouj2gm")
    //     return console.log(auth)
    // }

    // cobi()
})

module.exports = conn