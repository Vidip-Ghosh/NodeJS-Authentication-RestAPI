require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT;
console.log(port)
const cors = require('cors')
app.use(cors())
app.use(express.json())
const userRoute = require('./routes/userRouter');
const authRoute = require('./routes/authRoute');

app.get('/', function (req, res) {
    res.send({ title: 'GeeksforGeeks' });
});

app.use('/api',userRoute);
app.use('/',authRoute);
app.set('view engine','ejs')
app.set('views','./views');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/restful-auth-api').then(()=>
{
    console.log("connection is successfull")
}).catch((e)=>{
    console.log(e);
})

app.listen(port,()=>{
    console.log(`Server listening on port no ${port}`);
})