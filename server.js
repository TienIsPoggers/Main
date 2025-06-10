require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const routes = require('./routes/routes.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'./public')))
app.get('/', (req, res) => {
  res.send('Server is live! Welcome to the backend!');
});
app.use('/',routes)
app.use((req,res)=>{
    res.redirect('/404');
})

app.listen(PORT,() => {console.log(`Server start with URL: http://localhost:${PORT}`)})