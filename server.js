const express = require('express');
const path = require('path');
const routes = require('./routes/routes.js');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'./public')))
app.use('/',routes)
app.use((req,res)=>{
    res.redirect('/404');
})

app.listen(PORT,() => {console.log(`Server start with URL: http://localhost:${PORT}`)})