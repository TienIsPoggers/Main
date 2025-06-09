const express = require('express');
const fs = require('fs').promises
const path = require('path');
const router = express.Router();
var globalRoot;
var header = {},footer = {};
unLoadHeader();
async function unLoadHeader(){
    header['data'] = await fs.readFile(path.join(__dirname,"../public/header.html"),"utf8");
    header['content'] = await fs.readFile(path.join(__dirname,"../content/header.json"),"utf8");
    footer['data'] = await fs.readFile(path.join(__dirname,"../public/footer.html"),"utf8");
    footer['content'] = await fs.readFile(path.join(__dirname,"../content/footer.json"),"utf8");
    globalRoot = await fs.readFile('./content/root.json',"utf8");
}``
router.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,"../public/index.html"))
})
router.get('/about',(req,res) => {
    res.sendFile(path.join(__dirname,"../public/about.html"))
})
router.get('/service',(req,res) => {
    res.sendFile(path.join(__dirname,"../public/service.html"))
})
router.get('/projects',(req,res) => {
    res.sendFile(path.join(__dirname,"../public/projects.html"))
})
router.get('/contact',(req,res) => {
    res.sendFile(path.join(__dirname,"../public/contact.html"))
})
router.get('/404',(req,res) => {
    res.sendFile(path.join(__dirname,"../public/404.html"))
})
router.post('/api',async (req,res) => {
    var item = req.body.url;
    if(item === '/')
        item += 'index'
    let data = await fs.readFile(`./content${item}.json`,"utf8")
    res.send({data: data});
})
router.get('/api/theme',async (req,res) => {
    await unLoadHeader();
    while(!header || !footer || !globalRoot) res.sendStatus(404);
    res.json({header:header,footer:footer,root: globalRoot})
})
module.exports = router;