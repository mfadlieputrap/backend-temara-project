const express = require('express')
const setupRoutes = require('./routes/routes')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const PORT = 9000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

setupRoutes(app)



app.listen(PORT, function(){
    console.log(`Server running at port http://localhost:${PORT}`)
})