require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { json } = require('express');
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser);
app.use(cors);
app.use(fileupload({
  useTempFiles:true
}))


const URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
},
  err => {
    if (err) throw err;
    console.log("connected to db");
  })
// app.get('/',(req,res)=>{
//   res.json({msg:"check"});
// });
app.use('/user', require('./routes/userRouters'));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}`);
})